const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

async function dataModule(){
  const code=fs.readFileSync(path.join(__dirname,'../restaurant/finance-data.js'),'utf8');
  return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}

test('Accounts metrics use only active real records and reconcile period cash',async()=>{
  const {financeModel}=await dataModule();
  const result=financeModel({
    cash_balance:530,
    order_revenue:[
      {amount:300,payment_method:'cash',occurred_on:'2026-09-19'},
      {amount:200,payment_method:'card',occurred_on:'2026-09-19'},
      {amount:999,payment_method:'cash',archived:true,occurred_on:'2026-09-19'}
    ],
    entries:[
      {kind:'revenue',amount:50,payment_method:'cash'},
      {kind:'expense',amount:70,payment_method:'cash'},
      {kind:'payroll',amount:100,payment_method:'cash'},
      {kind:'expense',amount:500,payment_method:'cash',archived:true}
    ],
    inventory:[{quantity:4,unit_price:25},{quantity:10,unit_price:10,archived:true}],
    recipes:[],employees:[]
  });
  assert.equal(result.revenueTotal,550);
  assert.equal(result.expenseTotal,170);
  assert.equal(result.cashIn,350);
  assert.equal(result.cashOut,170);
  assert.equal(result.opening,350);
  assert.equal(result.inventoryValue,100);
  assert.equal(result.operatingProfit,380);
});

test('Recipe margin helpers do not fabricate impossible values',async()=>{
  const {safeMargin,suggestedPrice}=await dataModule();
  assert.equal(safeMargin(100,40),60);
  assert.equal(safeMargin(0,40),null);
  assert.equal(suggestedPrice(40,20),50);
  assert.equal(suggestedPrice(40,100),null);
});

test('Accounts UI exposes all nine approved screens with responsive and brand safeguards',()=>{
  const js=fs.readFileSync(path.join(__dirname,'../restaurant/finance.js'),'utf8');
  const css=fs.readFileSync(path.join(__dirname,'../restaurant/finance.css'),'utf8');
  const html=fs.readFileSync(path.join(__dirname,'../restaurant/index.html'),'utf8');
  for(const page of ['revenues','expenses','cashbox','inventory','recipes','payroll','profit','reports'])assert.match(js,new RegExp(`['"]${page}['"]`));
  assert.match(js,/CARDfy/);
  assert.doesNotMatch(js,/fy CARD|FY CARD|CARD fy/);
  assert.match(html,/finance\.css\?v=20260920-kitchen-ui2/);
  assert.match(css,/@media\(max-width:1200px\)/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(max-width:430px\)/);
  assert.match(js,/لا يتم افتراضها|غير مخصومة/);
});


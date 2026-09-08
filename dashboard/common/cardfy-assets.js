(function(){
  const SUPA_URL='https://ytixcczbjmjnuotzavbb.supabase.co';
  const TOKEN_KEY='cardfy_client_token_v1';
  function token(){return localStorage.getItem(TOKEN_KEY)||''}
  async function json(res){let body={};try{body=await res.json()}catch(e){}if(!res.ok)throw new Error(body.error||'asset_request_failed');return body}
  async function upload(service,file,opts={}){
    if(!file)throw new Error('file_required');
    const fd=new FormData();fd.append('token',token());fd.append('service',service);fd.append('file',file);if(opts.bookingId)fd.append('booking_id',opts.bookingId);
    return json(await fetch(SUPA_URL+'/functions/v1/cardfy-upload',{method:'POST',body:fd}));
  }
  async function signedPrivateUrl(path,expiresSeconds=300){
    return json(await fetch(SUPA_URL+'/functions/v1/cardfy-private-asset-url',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:token(),path,expires_seconds:expiresSeconds})}));
  }
  async function remove(bucket,path){
    return json(await fetch(SUPA_URL+'/functions/v1/cardfy-delete-asset',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:token(),bucket,path})}));
  }
  window.CardfyAssets={upload,signedPrivateUrl,remove,TOKEN_KEY};
})();
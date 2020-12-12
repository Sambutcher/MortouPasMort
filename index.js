let codeQ;

fetch('https://Mort-ou-pas-mort-API.samuelboucher1.repl.co/questionAPI?topic=mort')
    .then(res=>res.json())
    .then(data=>{
      document.getElementById('OK').hidden=false;
      document.getElementById('NOK').hidden=false;
      document.getElementById('personne').innerHTML=data.person;
      codeQ=data.id;
      });
    
document.getElementById('OK').addEventListener('click', ()=>réponse(false));
document.getElementById('NOK').addEventListener('click', ()=>réponse(true));
document.getElementById('suivant').addEventListener('click', ()=>{location.reload();return false;});


function réponse(answer){
  document.getElementById('OK').disabled=true;
  document.getElementById('NOK').disabled=true;
  if (answer){
    document.getElementById('OK').className="btn btn-light";
  } else {
    document.getElementById('NOK').className="btn btn-light";
  }
  fetch('https://Mort-ou-pas-mort-API.samuelboucher1.repl.co/reponseAPI?topic=mort&value='+codeQ)
  .then(res=>res.json())
  .then(data=>{
    if(data.value==answer){
      document.getElementById('reponse').innerHTML='Gagné!';
      document.getElementById('reponse').style.color='limegreen';
    } else {
      document.getElementById('reponse').innerHTML='Perdu!';
      document.getElementById('reponse').style.color='red';
    }
    document.getElementById('suivant').hidden=false;
    if (data.value){
      let date=new Date (data.info);
      document.getElementById('complement').innerHTML='En '+date.getFullYear();
    }
  });
}
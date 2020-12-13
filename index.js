document.getElementById('OK').addEventListener('click', ()=>réponse(false));
document.getElementById('NOK').addEventListener('click', ()=>réponse(true));
document.getElementById('suivant').addEventListener('click',question);

let codeQ;

function question(){
  fetch('https://Mort-ou-pas-mort-API.samuelboucher1.repl.co/questionAPI?topic=mort')
  .then(res=>res.json())
  .then(data=>{
    document.getElementById('OK').hidden=false;
    document.getElementById('OK').disabled=false;
    document.getElementById('OK').className="btn btn-success";
    document.getElementById('NOK').hidden=false;
    document.getElementById('NOK').disabled=false;
    document.getElementById('NOK').className="btn btn-danger";
    document.getElementById('personne').innerHTML=data.person;
    document.getElementById('reponse').hidden=true;
    document.getElementById('suivant').hidden=true;
    document.getElementById('complement').hidden=true;
    document.getElementById('score').hidden=true;

    codeQ=data.id;
    localStorage.setItem('scoreTotal',parseInt(localStorage.getItem('scoreTotal'),10)+1);
  });
}

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
    document.getElementById('reponse').hidden=false;
    document.getElementById('suivant').hidden=false;
    document.getElementById('score').hidden=false;
    
    if(data.value==answer){
      document.getElementById('reponse').innerHTML='Gagné!';
      document.getElementById('reponse').style.color='limegreen';
      localStorage.setItem('scoreWin',parseInt(localStorage.getItem('scoreWin'),10)+1);
    } else {
      document.getElementById('reponse').innerHTML='Perdu!';
      document.getElementById('reponse').style.color='red';
    }
    if (data.value){
      let date=new Date (data.info);
      document.getElementById('complement').hidden=false;
      document.getElementById('complement').innerHTML='En '+date.getFullYear();
    }

    document.getElementById('scoreValue').innerHTML=localStorage.getItem('scoreWin')+'/'+localStorage.getItem('scoreTotal');

  });
}

window.onload=function(){
  if (!localStorage.getItem('scoreTotal')){
    localStorage.setItem('scoreTotal',0);
    localStorage.setItem('scoreWin',0);    
  }

  question();
}
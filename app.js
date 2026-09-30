const node=id=>document.querySelector(`[data-node-id="5:${id}"]`);
const named=name=>document.querySelector(`[data-name="${name}"]`);
function retag(el,tag,attrs={}){const next=document.createElement(tag);for(const a of el.attributes)next.setAttribute(a.name,a.value);Object.assign(next,attrs);next.append(...el.childNodes);el.replaceWith(next);return next;}
const sections={3098:'when',3048:'home',3145:'directions',3205:'approach',3247:'about',3281:'team',3316:'reviews',3356:'faq',3403:'appointment',3433:'contacts'};
for(const [id,anchor] of Object.entries(sections))retag(node(id),id==='3433'?'footer':'section',{id:anchor});
retag(node(3073),'h1');
for(const id of [3118,3151,3210,3253,3287,3322,3362,3409])retag(node(id),'h2');
for(const id of [3127,3132,3137,3142,3162,3170,3178,3186,3194,3202,3295,3303,3311])retag(node(id),'h3');
retag(named('Навигация'),'header');
const nav=retag(named('Ссылки'),'nav',{'id':'main-nav'});nav.setAttribute('aria-label','Основная навигация');
['directions','approach','team','reviews','contacts'].forEach((id,i)=>retag(nav.children[i],'a',{href:'#'+id}));
const menu=document.createElement('button');menu.className='menu-toggle';menu.type='button';menu.textContent='Меню';menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-controls','main-nav');named('Навигация').append(menu);
function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.textContent='Меню';}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Закрыть':'Меню';});
nav.addEventListener('click',closeMenu);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const dialog=document.createElement('dialog');dialog.className='info-dialog';dialog.innerHTML='<h2></h2><p></p><button class="dialog-close" type="button">Закрыть</button>';document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close();};
function showInfo(title,text){dialog.querySelector('h2').textContent=title;dialog.querySelector('p').textContent=text;dialog.showModal();}
for(const el of document.querySelectorAll('[data-name="Кнопка"]')){
 const id=el.dataset.nodeId;if(id==='5:3429')continue;
 const link=retag(el,'a',{href:'#appointment'});
 if(id==='5:3289'){link.href='#team';link.addEventListener('click',e=>{e.preventDefault();showInfo('Команда центра','В макете представлены Анна Лебедева, Михаил Орлов и Елена Волкова. Информацию об остальных специалистах и доступном времени можно уточнить по телефону +7 (495) 128-44-19.');});}
 if(id==='5:3369'){link.href='mailto:hello@bereg-center.ru';link.setAttribute('aria-label','Написать координатору');link.addEventListener('click',e=>{e.preventDefault();showInfo('Связаться с координатором','Адрес мессенджера пока не указан. Напишите на hello@bereg-center.ru или позвоните +7 (495) 128-44-19.');});}
}
for(const el of document.querySelectorAll('p')){const text=el.textContent.trim();if(text==='+7 (495) 128-44-19')retag(el,'a',{href:'tel:+74951284419'});if(text==='hello@bereg-center.ru')retag(el,'a',{href:'mailto:hello@bereg-center.ru'});}
retag(named('Маршрут'),'a',{href:'https://yandex.ru/maps/?text='+encodeURIComponent('Москва, ул. Усачёва, 11'),target:'_blank',rel:'noopener noreferrer'});
for(const name of ['Телеграм','Сообщество']){const button=retag(named(name),'button',{type:'button'});button.setAttribute('aria-label',name);button.onclick=()=>showInfo(name,'Ссылка на сообщество пока не указана. Контакты центра: +7 (495) 128-44-19, hello@bereg-center.ru.');}
for(const id of [3464,3465]){const button=retag(node(id),'button',{type:'button'});button.style.cssText+=';background:transparent;padding:0;cursor:pointer;text-align:left';button.onclick=()=>showInfo(button.textContent.trim(),id===3464?'Форма пока не передаёт и не сохраняет персональные данные. Перед подключением приёма заявок владелец сайта должен разместить свою политику обработки персональных данных.':'Реквизиты организации не предоставлены в макете. Их необходимо добавить перед публикацией сайта.');}
const answers=[null,'Формат участия родителей обсудим на первой встрече: он зависит от запроса и того, как ребёнку комфортнее знакомиться со специалистом.','Продолжительность маршрута индивидуальна. План и динамику обсуждаем с семьёй; в макете предусмотрено уточнение плана раз в 8–12 недель.','Расскажите координатору об имеющихся заключениях и возьмите их на первую встречу, чтобы специалист мог учесть предыдущие наблюдения.','Начинаем с контакта и знакомства. Не заставляем заниматься через сопротивление: ищем комфортный для ребёнка формат.','Возможность и время онлайн-консультации уточните у координатора по телефону +7 (495) 128-44-19.'];
document.querySelectorAll('[data-name="Вопрос"]').forEach((card,i)=>{
 const button=retag(card.firstElementChild,'button',{type:'button'});let answer=card.querySelector(':scope > p');
 if(!answer){answer=document.createElement('p');answer.className='faq-answer';answer.textContent=answers[i];card.append(answer);}
 answer.id='answer-'+i;answer.hidden=i!==0;button.setAttribute('aria-controls',answer.id);button.setAttribute('aria-expanded',String(i===0));
 button.onclick=()=>{const open=answer.hidden;answer.hidden=!open;button.setAttribute('aria-expanded',String(open));card.style.background=open?'#dce6dd':'#f5f1e9';const icon=button.querySelector('img');icon.src=open?'assets/2640c.svg':'assets/471e6.svg';button.querySelector('[data-name="Переключатель"]').style.background=open?'#315a50':'#fffdf8';};
});
const form=retag(named('Форма записи'),'form');form.setAttribute('aria-label','Запись на консультацию');
const fields=named('Поля формы');fields.innerHTML='<input aria-label="Ваше имя" name="name" autocomplete="given-name" placeholder="Ваше имя" required minlength="2" maxlength="80"><input aria-label="Номер телефона" name="phone" autocomplete="tel" inputmode="tel" type="tel" placeholder="+7 (___) ___-__-__" required><textarea aria-label="Возраст ребёнка и ваш вопрос" name="message" placeholder="Возраст ребёнка и кратко ваш вопрос" rows="1" maxlength="1000"></textarea>';
const submit=retag(node(3429),'button',{type:'submit'});submit.setAttribute('aria-label','Отправить заявку');
const status=document.createElement('p');status.className='form-status';status.setAttribute('role','status');status.hidden=true;form.append(status);
const phone=form.elements.phone;phone.addEventListener('input',()=>phone.setCustomValidity(''));
form.addEventListener('submit',e=>{e.preventDefault();const digits=phone.value.replace(/\D/g,'');if(digits.length<10||digits.length>15){phone.setCustomValidity('Укажите номер телефона: от 10 до 15 цифр.');phone.reportValidity();return;}status.hidden=false;status.textContent='Отправка заявок пока не подключена. Данные не отправлены. Для записи позвоните +7 (495) 128-44-19 или напишите hello@bereg-center.ru.';});
const alts={'cff8a.png':'Специалист занимается с ребёнком за игровым столом','7816f.png':'Совместная игра ребёнка и специалиста','42893.png':'Светлая игровая комната центра','81d1f.png':'Развивающие материалы на полках','b2f3d.png':'Анна Лебедева, нейропсихолог','6e68d.png':'Михаил Орлов, логопед-дефектолог','38eb6.png':'Елена Волкова, детский психолог'};
document.querySelectorAll('img').forEach(img=>{const name=img.getAttribute('src').split('/').pop();img.alt=alts[name]||'';if(name.endsWith('.png')&&name!=='cff8a.png')img.loading='lazy';img.decoding='async';});

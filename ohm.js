(() => {
  'use strict';
  const R_VALUES = [10,20,30,40,50,60,80,100,120,150,200];
  const I_VALUES = [50,100,150,200,250,300,400,500];
  const el = id => document.getElementById(id);
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const format = n => Number(n.toFixed(3)).toLocaleString('nl-BE', { maximumFractionDigits:3 });
  let exercise;

  function generate() {
    const valid = R_VALUES.flatMap(R => I_VALUES.map(mA => ({ R, mA, U:R*mA/1000, P:R*(mA/1000)**2 })))
      .filter(x => x.U >= 1 && x.U <= 24 && x.P <= 2);
    const values = pick(valid);
    const target = pick(['R','I','U']);
    return {
      topic:'Wet van Ohm', level:'basis', situation:'gesloten gelijkstroomkring',
      components:[{id:'R1', type:'vaste ohmse weerstand', value:values.R, unit:'Ω'}],
      connections:[['bron+','R1'],['R1','bron−']], source:{ voltage:values.U, unit:'V' },
      current:{value:values.mA,unit:'mA'}, target,
      answer:target === 'R' ? values.R : target === 'I' ? values.mA : values.U,
      unit:target === 'R' ? 'Ω' : target === 'I' ? 'mA' : 'V',
      hint:target === 'R' ? 'Gebruik R = U / I. Zet mA eerst om naar A.' :
        target === 'I' ? 'Gebruik I = U / R. Zet de uitkomst van A om naar mA.' :
        'Gebruik U = R × I. Zet mA eerst om naar A.'
    };
  }

  function svgNode(type, attributes, text) {
    const node = document.createElementNS('http://www.w3.org/2000/svg',type);
    Object.entries(attributes).forEach(([key,value]) => node.setAttribute(key,String(value)));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function draw(x) {
    const diagram = el('diagram');
    diagram.replaceChildren();
    const description = `Gesloten kring met links een bron waarvan de spanning ${x.target === 'U' ? 'gevraagd is' : `${format(x.source.voltage)} V bedraagt`} en rechts R1, een vaste ohmse weerstand. Stroomsterkte ${x.target === 'I' ? 'is gevraagd' : `is ${x.current.value} mA`}; weerstand ${x.target === 'R' ? 'is gevraagd' : `is ${x.components[0].value} Ω`}.`;
    diagram.append(svgNode('title',{id:'diagram-title'},'Schema van de oefening'),svgNode('desc',{id:'diagram-desc'},description));
    const stroke = {stroke:'#17232d','stroke-width':3,fill:'none'};
    [ [60,40,350,40],[350,40,350,80],[350,130,350,175],[350,175,60,175],[60,175,60,126],[60,90,60,40] ].forEach(([x1,y1,x2,y2])=>diagram.append(svgNode('line',{x1,y1,x2,y2,...stroke})));
    diagram.append(svgNode('line',{x1:42,y1:91,x2:78,y2:91,...stroke}),svgNode('line',{x1:49,y1:124,x2:71,y2:124,...stroke}));
    diagram.append(svgNode('rect',{x:328,y:80,width:44,height:50,stroke:'#17232d','stroke-width':3,fill:'#fff'}));
    const label = (px,py,t) => diagram.append(svgNode('text',{x:px,y:py,fill:'#17232d','font-size':16,'font-family':'system-ui, sans-serif','text-anchor':'middle'},t));
    label(60,70,'+'); label(60,150,'−'); label(130,113,x.target === 'U' ? 'U = ?' : `${format(x.source.voltage)} V`); label(350,70,'R1');
    label(350,155,x.target === 'R' ? 'R = ?' : `${x.components[0].value} Ω`);
    label(205,29,x.target === 'I' ? 'I = ?' : `I = ${x.current.value} mA`);
    el('diagram-caption').textContent = description;
  }
  function render() {
    exercise = generate();
    const x = exercise;
    const known = x.target === 'R' ? `U = ${format(x.source.voltage)} V en I = ${x.current.value} mA` :
      x.target === 'I' ? `U = ${format(x.source.voltage)} V en R1 = ${x.components[0].value} Ω` :
      `R1 = ${x.components[0].value} Ω en I = ${x.current.value} mA`;
    el('exercise').replaceChildren();
    const p = document.createElement('p');
    p.textContent = `Gegeven: één vaste ohmse weerstand in een gelijkstroomkring; ${known}. Gevraagd: bereken ${x.target} in ${x.unit}.`;
    el('exercise').append(p);
    el('answer-unit').textContent = `(${x.unit})`;
    el('answer').value=''; el('hint').textContent=''; el('feedback').textContent='';
    el('feedback').removeAttribute('data-state');
    draw(x);
  }
  el('answer-form').addEventListener('submit',event=>{
    event.preventDefault();
    const raw=el('answer').value.trim();
    const feedback=el('feedback');
    const normalized=raw.replace(',','.');
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized) || !Number.isFinite(Number(normalized))) {
      feedback.dataset.state='error'; feedback.textContent='Vul een positief getal in, zonder eenheid. Een komma of punt mag allebei.'; return;
    }
    const number=Number(normalized);
    if (number <= 0) { feedback.dataset.state='error'; feedback.textContent='Vul een getal groter dan nul in.'; return; }
    const correct=Math.abs(number-exercise.answer)<Math.max(0.011,exercise.answer*0.001);
    feedback.dataset.state=correct?'success':'error';
    feedback.textContent=correct?'Juist! Je gebruikte de juiste waarde en eenheid.':
      exercise.target === 'R' || exercise.target === 'U' ? 'Nog niet juist. Controleer je formule, de omzetting van mA naar A en de eenheid.':
      'Nog niet juist. Controleer de formule en denk eraan dat je antwoord in mA gevraagd wordt.';
  });
  el('hint-button').addEventListener('click',()=>{el('hint').textContent=exercise.hint;});
  el('new-button').addEventListener('click',render);
  render();
})();

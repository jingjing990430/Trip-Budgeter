// arr function
// template literals
// destructuring
// spread operator
// funnction hoisting函数声明会提升，函数表达式不会

// dom helpers
const $=sel=>document.querySelector(sel);
// 'hello' +value =`hello ${value}`
const fmt=num=>`$ ${Number(num).toFixed(2)}`;
// app state
let state={
    meta:{ createdAt:new Date().toISOString().slice(0,10), currency:'AUD' },
    // { id, title,category, amount, date}
    expenses:[]
}
// 剩余参数...nums不管有多少个参数，都会放在nums数组里
// reduce((acc,cur)=>{},initVal) acc:累计值，cur:当前值
const sum=(...nums)=>nums.reduce((acc,n)=>acc+Number(n||0),0);
// render UI
function render(list=state.expenses) {
    const ul=$('#items');
    ul.innerHTML=list.map(({id,title,category,amount,date})=>`
        <li>
            <div>
                <div>
                    <strong>${title}</strong>
                    <span class='pill'>${category}</span>
                </div>
                <div class='meta'>${date || '-'}</div>
            </div>
            <div>
                <span class='amount'>${fmt(amount)}</span>
                <button class='remove' data-id='${id}'>Remove</button>
            </div>
        </li>
    `).join('')
    const total=sum(...state.expenses.map(i=>i.amount));
    $('#total').textContent=`Total:${fmt(total)}`;
}
// add new expense
$('#add-form').addEventListener('submit',e=>{
    e.preventDefault();
    // 解构
    const el=e.currentTarget.elements;
    const {value:title}=el.itemTitle;
    const {value:category}=el.category;
    const {value:amountStr}=el.amount;
    const {value:date}=el.date;
    if(!title.trim()) return ;
    const amount=Number(amountStr||0);
    // crypto.randomUUID() 生成唯一id
    // 是browser内置的加密模块,全局api,如果不支持就用时间戳+随机数fallback
    const id=(crypto.randomUUID?.()??(Date.now()+Math.random().toString(16).slice(2)));
    const item={id,title,category,amount,date};
    state={...state,expenses:[...state.expenses,item]};
    e.currentTarget.reset();
    render();applyFilters();
});
// remove expense
// filter
$('#clear').addEventListener('click',()=>{
    $('#search').value='';
    $('#cat').value='All';
    render()
});
const applyFilters=()=>{
    const search=$('#search').value.trim().toLowerCase();
    const cat=$('#cat').value;
    const list=state.expenses.filter(({title,category})=>
    (cat==='All'||category===cat) && 
    (search ==='' || title.toLowerCase().includes(search))
    )
    render(list);
}
// 输入框有变化就触发
$('#search').addEventListener('input',applyFilters);
$('#cat').addEventListener('change',applyFilters);

// sort
$('#sort-amount').addEventListener('click',()=>{
    state={...state,expenses:[...state.expenses].sort((a,b)=>b.amount-a.amount)};
    render();applyFilters();
});
$('#sort-date').addEventListener('click',()=>{
    state={...state,expenses:[...state.expenses].sort((a,b)=>(b.date||'').localeCompare(a.date||''))};
    render();applyFilters();
});
// remove
$('#items').addEventListener('click',e=>{
    const btn=e.target.closest('button.remove');
    if(!btn) return;
    const {id}=btn.dataset;
    state={...state,expenses:state.expenses.filter(i=>i.id!==id)};
    render();applyFilters();
});
// load initial data
// initial render
render();
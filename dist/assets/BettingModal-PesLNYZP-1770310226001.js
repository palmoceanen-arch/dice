var h=Object.defineProperty;var p=(r,t,e)=>t in r?h(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var n=(r,t,e)=>p(r,typeof t!="symbol"?t+"":t,e);import{t as a,w as u}from"./index-AKCTbsdO-1770310226000.js";class o{static init(){console.log("[BettingModal] Initialized")}static show(t=10,e=0){this.overlay||(this.minBet=t,this.userBalance=e,this.currentBet=t,this.confirmed=!1,this.overlay=document.createElement("div"),this.overlay.className="betting-modal-overlay",this.overlay.innerHTML=`
      <div class="betting-modal">
        <div class="betting-header">
          <span class="balance">💰 ${e.toLocaleString()} pips</span>
          <button class="close-btn">✕</button>
        </div>
        
        <div class="betting-content">
          <h3>${a("betting.title")}</h3>
          <p class="betting-subtitle">${a("betting.subtitle")}</p>
          
          <div class="bet-options">
            <button class="bet-btn" data-amount="10">10</button>
            <button class="bet-btn" data-amount="50">50</button>
            <button class="bet-btn" data-amount="100">100</button>
            <button class="bet-btn" data-amount="500">500</button>
          </div>
          
          <div class="custom-bet">
            <label>${a("betting.customAmount")}</label>
            <input type="number" class="custom-bet-input" min="${t}" max="${e}" value="${t}" />
          </div>
          
          <div class="pot-display">
            <div class="pot-label">${a("betting.pot")}</div>
            <div class="pot-amount">0 pips</div>
          </div>
          
          <div class="players-bets"></div>
        </div>
        
        <div class="betting-footer">
          <button class="confirm-btn" disabled>
            ✓ ${a("betting.confirm")} ${t} pips
          </button>
        </div>
      </div>
    `,document.body.appendChild(this.overlay),this.attachEventListeners(),this.updateUI())}static attachEventListeners(){if(!this.overlay)return;this.overlay.querySelector(".close-btn")?.addEventListener("click",()=>this.hide()),this.overlay.querySelectorAll(".bet-btn").forEach(s=>{s.addEventListener("click",c=>{const d=parseInt(c.target.dataset.amount||"0");this.selectBet(d)})}),this.overlay.querySelector(".custom-bet-input")?.addEventListener("input",s=>{const c=parseInt(s.target.value||"0");this.selectBet(c)}),this.overlay.querySelector(".confirm-btn")?.addEventListener("click",()=>this.confirmBet()),this.overlay.addEventListener("click",s=>{s.target===this.overlay&&this.hide()})}static selectBet(t){this.confirmed||t<this.minBet||t>this.userBalance||(this.currentBet=t,console.log("[BETTING] Selecting bet:",t),u.send({type:"place_bet",amount:t}),this.updateUI())}static confirmBet(){this.confirmed||this.currentBet<this.minBet||(console.log("[BETTING] Confirming bet:",this.currentBet),this.confirmed=!0,u.send({type:"confirm_bet"}),this.updateUI())}static updateUI(){if(!this.overlay)return;this.overlay.querySelectorAll(".bet-btn").forEach(s=>{const c=parseInt(s.dataset.amount||"0");s.classList.toggle("active",c===this.currentBet),s.classList.toggle("disabled",c>this.userBalance||this.confirmed)});const e=this.overlay.querySelector(".custom-bet-input");e&&(e.value=this.currentBet.toString(),e.disabled=this.confirmed);const i=this.overlay.querySelector(".confirm-btn");i&&(i.textContent=this.confirmed?`✓ ${a("betting.waiting")}`:`✓ ${a("betting.confirm")} ${this.currentBet} pips`,i.classList.toggle("confirmed",this.confirmed),i.disabled=this.confirmed||this.currentBet<this.minBet);const l=this.overlay.querySelector(".pot-amount");l&&(l.textContent=`${this.pot.toLocaleString()} pips`),this.updatePlayersBets()}static updatePlayersBets(){if(!this.overlay)return;const t=this.overlay.querySelector(".players-bets");if(t){if(this.allBets.length===0){t.innerHTML="";return}t.innerHTML=`
      <div class="bets-list">
        <div class="bets-header">${a("betting.playersBets")}</div>
        ${this.allBets.map(e=>`
          <div class="bet-item ${e.confirmed?"confirmed":"pending"}">
            <span class="bet-player">${e.nickname||`Player ${e.userId}`}</span>
            <span class="bet-amount">${e.amount} pips</span>
            <span class="bet-status">${e.confirmed?"✓":"⏳"}</span>
          </div>
        `).join("")}
      </div>
    `}}static updatePot(t,e){if(console.log("[BETTING] updatePot called:",{pot:t,bets:e,betsCount:e.length}),this.pot=t,this.allBets=e,t===0&&e.length>0){const i=e.reduce((l,s)=>l+s.amount,0);console.log("[BETTING] Calculated preliminary pot:",i),this.pot=i}this.updateUI()}static updateBalance(t){if(this.userBalance=t,this.overlay){const e=this.overlay.querySelector(".balance");e&&(e.textContent=`💰 ${t.toLocaleString()} pips`)}}static onBetConfirmed(){this.confirmed=!0,this.updateUI()}static onBettingComplete(){setTimeout(()=>{this.hide()},2e3)}static hide(){this.overlay&&(this.overlay.remove(),this.overlay=null),this.currentBet=0,this.confirmed=!1,this.pot=0,this.allBets=[]}static isOpen(){return this.overlay!==null}}n(o,"overlay",null),n(o,"currentBet",0),n(o,"confirmed",!1),n(o,"minBet",10),n(o,"userBalance",0),n(o,"pot",0),n(o,"allBets",[]);export{o as BettingModal};



function CookiePop(selector, origin) {
    let default_option = {
        btn: '.close',
        expireDays: 1,
        speed: 500,
    }
    // default_option을 origin으로 덮어쓰기한 새로운 객체를 반환
    let opt = Object.assign({}, default_option, origin)

    this.initDOM(selector, opt)
    this.bindingEvent(selector, opt);
}

CookiePop.prototype.initDOM = function(selector, opt) {
    this.popup = document.querySelector(selector);
    this.btnClose = document.querySelector(opt.btn);
    this.checkInput = this.popup.querySelector('input[type=checkbox]');
    this.btnDel = document.querySelector('.del');
}


CookiePop.prototype.bindingEvent = function(selector, opt) {
    // 처음 로딩 시 쿠키가 있으면 팝업을 숨김, 없으면 보임
    let cookieData = document.cookie;
    // console.log(cookieData)
    if( cookieData.indexOf(`${selector}`) < 0 ) {
        console.log('쿠키없음')
        this.popup.style.display = 'block';
    } else {
        console.log('쿠키있음')
        this.popup.style.display = 'none';
    }



    // 닫기 버튼 클릭 시 팝업을 닫는데 (체크했으면 쿠키 생성)
    this.btnClose.onclick = function(e) {
        e.preventDefault();
        if(this.checkInput.checked) this.setCookie(`${selector}`, 'done', opt.expireDays)
        this.animate(this.popup, {
            prop: 'opacity',
            value: 0,
            duration: opt.speed,
            callback: function() {
                this.popup.style.display = 'none';
            }.bind(this)
        })
    }.bind(this)



    // 쿠키삭제 버튼 클릭 시 생성된 쿠키 삭제
    this.btnDel.onclick = function(e) {
        e.preventDefault();
        this.setCookie('today', 'done', 0)
    }.bind(this)
}



CookiePop.prototype.setCookie = function(name, value, expireDays) {
    let today = new Date();
    let dueDate = today.getDate() + expireDays //오늘부터 파라미터로 들어온 날 더함
    today.setDate(dueDate);

    let result = today.toGMTString(); //GTM로 변환
    
    document.cookie = `${name}: ${value}; path:/; expires=${result}`;
}

CookiePop.prototype.animate = function(selector, option) {
    const startTime = performance.now();
    let current_value;

    if(option.prop === "opacity"){
        current_value = parseFloat( getComputedStyle(selector)[option.prop]);
    }else{
        current_value = parseInt( getComputedStyle(selector)[option.prop]);
    }
    

    if(current_value == option.value) return;
    if(current_value < option.value ) {
        requestAnimationFrame(run_plus);
    }else{
        requestAnimationFrame(run_minus);
    } 

    function  run_plus(time){           
        let timeLast = time - startTime; 
        let progress = timeLast / option.duration; 
    
        if(progress < 0) progres = 0; 
        if(progress > 1 ) progress = 1; 
        if(progress < 1 ){
            timer = requestAnimationFrame(run_plus); 
        }else{
            cancelAnimationFrame(timer);
            if(option.callback) option.callback();
        }     
      
        let result = current_value + ( (option.value - current_value)*progress  );

        if(option.prop === "opacity"){
            selector.style[option.prop] = result; 
        }else{
            selector.style[option.prop] = result+"px"; 
        }             
    }

    function  run_minus(time){           
        let timeLast = time - startTime; 
        let progress = timeLast / option.duration; 
    
        if(progress < 0) progres = 0; 
        if(progress > 1 ) progress = 1; 
        if(progress < 1 ){
            timer = requestAnimationFrame(run_minus); 
        }else{
            cancelAnimationFrame(timer);
            if(option.callback) option.callback();
        }       
      
        let result = current_value - ( (current_value - option.value)*progress  );

        if(option.prop === "opacity"){
            selector.style[option.prop] = result; 
        }else{
            selector.style[option.prop] = result+"px"; 
        }       
    }
}











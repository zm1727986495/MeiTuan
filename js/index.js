/*scenes*/
let scenesRender = (function () {
    let scenes_container = document.querySelector('.scenes-container'),
        lity_area = scenes_container.querySelector('.lity_area'),
        lity_select = lity_area.querySelectorAll('.lity_select'),
        scenes_nav = document.querySelector('.scenes_nav'),
        list = scenes_nav.querySelectorAll('li');

    let queryData = function () {
        return new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.open('get', 'json/data.json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    res(data)
                }
            };
            xhr.send(null);
        })
    };

    let bindHTML = function (data) {
        let str = ``;
        for (let i = 0; i < data.length; i += 5) {
            lity_select.forEach((item, index) => {
                let time = data[index + i];

                if (!item) return;
                let {id, title, img, sub_title, price} = time;
                str = ` <a href="#" class="lity_card">
                     <div class="lity-img">
                         <img src="${img}" alt="">
                     </div>
                     <div class="poi-info">
                         <ul>
                             <li title="${title}" class="title">${title}</li>
                             <li class="sub-title">${sub_title}</li>
                             <li class="price-info">
                                 <span>
                                    <span class="price-symbol">¥</span>
                                    <span class="current-price">
                                        ${price}
                                         <span class="current-price-type">/人均</span>
                                     </span>
                                 </span>
                             </li>
                         </ul>
                     </div>
                 </a>`;

                item.innerHTML += str;
            });
        }

    };

    let lastIndex = 0;
    let clickHTML = function () {
        list = [].slice.call(list);
        list.shift();
        for (let i = 0; i < list.length; i++) {
            list[i].index = i;
            list[i].onmouseenter = function () {
                if (lastIndex === this.index) return;
                list[this.index].className = 'active';
                lity_select[this.index].className += ' show';
                list[lastIndex].className = '';
                lity_select[lastIndex].className = 'lity_select';
                lastIndex = this.index;
            }
        }
    };

    return {
        init: function () {
            queryData().then(bindHTML).then(clickHTML);
        }
    }
})();
scenesRender.init();
/*movie*/
let movieRender = (function () {
    let title = document.querySelector(".title"),
        change = title.querySelector(".change"),
        now = change.querySelector(".now"),
        future = change.querySelector(".future"),
        detail=document.querySelector(".detail"),
        movieAll=detail.querySelector(".movie_all"),
        linkList=null,
        arrow=detail.querySelector(".arrow"),
        arrowLeft=arrow.querySelector(".arrowLeft"),
        arrowRight=arrow.querySelector(".arrowRight"),
        focus=detail.querySelector(".focus1"),
        spanLeft=focus.querySelector(".left"),
        spanRight=focus.querySelector(".right");

    let hasClass = function (ele, content) {
        let strClass = ele.className;
        let aryClass = strClass.trim().split(" ");
        return aryClass.indexOf(content) > -1;
    };

    let addClass=function (ele,content) {
        if(hasClass(ele,content)) return;
        ele.className+=` ${content}`
    };

    let removeClass=function (ele,content) {
        if(!hasClass(ele,content)) return;
        let strClass=ele.className;
        let aryClass=strClass.split(" ");
        aryClass=aryClass.filter((item,index)=>{
            return item!==content;
        });
        ele.className=aryClass.join(" ");
    };

    let nextEle=function (ele) {
        let next=ele.nextSibling;
        while (next&&next.nodeType!==1){
            next=next.nextSibling;
        }
        return next;
    };

    let sameEle=function (ele) {
        if(!ele.parentNode.parentNode) return;
        let visPar=ele.parentNode.parentNode;
        let visAll=visPar.getElementsByTagName("*");
        visAll=[].slice.call(visAll);
        visAll=visAll.filter((item,index)=>{
            if(ele.tagName===item.tagName){
                return item;
            }
        });
        return visAll;
    };
    //=>获取数据
    let queryData = new Promise(function (resolve) {
        let xhr = new XMLHttpRequest();
        xhr.open("get", "json/movie.json", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                resolve(data);
            }
        };
        xhr.send(null);
    });
    //=>绑定点击事件，点击不同的按钮，容器内绑定不同的数据
    let clickEvent = function (data) {

        change.addEventListener("click", (ev) => {
            ev = ev || window.event;
            let target = ev.target ? ev.target : ev.srcElement,
                par = target.parentNode,
                I=nextEle(target),
                sameI=sameEle(I);
            if (target.tagName === "A" && hasClass(par, "now")) {
                bindHTML(data["now"]);
                sameI.forEach((item)=>{
                    removeClass(item,"show");
                });
                addClass(I,"show");

            }
            if (target.tagName === "A" && hasClass(par, "future")) {
                bindHTML(data["future"]);
                sameI.forEach((item)=>{
                    removeClass(item,"show");
                });
                addClass(I,"show");
            }
        });
        return data["now"];//=>便于页面展示的时候就让正在热映的先显示出来
    };
    //=>数据绑定
    let bindHTML = function (listData) {
        //=>有多少个数据，就有多少个li
        let str=``;
        listData.forEach((item,index)=>{
            let {imax,img,link,score,title} = item;
            str+=`<li>
                        <a href="${link}">
                            <img src="${imax}" alt="" class="imax">
                            <img src="${img}" alt="">
                            <div class="bg"></div>
                        <div class="buying">
                            <p>观众评<span>${score}</span></p>
                            <h4>${title}</h4><span class="ticket">购票</span>
                        </div>
                    </a>
                    </li>`;
        });
        movieAll.innerHTML=str;
    };

    //=>左右按钮切换
    let handleArrow=function () {
        //=>鼠标移动到盒子上的时候让两边的按钮出来
        detail.addEventListener("mouseenter",()=>{
            utils.css(arrow,"display","block");
        });
        detail.addEventListener("mouseleave",()=>{
            utils.css(arrow,"display","none");
        });
        detail.addEventListener("click",(ev)=>{

            ev=ev||window.event;
            let target=ev.target?ev.target:ev.srcElement,
                par=target.parentNode;
            if((target.tagName==="A"&&hasClass(target,"arrowLeft"))||(target.tagName==="SPAN"&&hasClass(target,"left"))){//=>证明点击的是左按钮
                console.log("ok");
                utils.css(movieAll,"transform",`translateX(0)`);
                // utils.css(movieAll,"left","10px");
                addClass(spanLeft,"active");
                removeClass(spanRight,"active");
            }
            if((target.tagName==="A"&&hasClass(target,"arrowRight"))||(target.tagName==="SPAN"&&hasClass(target,"right"))){//=>证明点击的是左按钮
                console.log("ok");
                utils.css(movieAll,"transform",`translateX(-1170px)`);
                // utils.css(movieAll,"left","-1160px");
                addClass(spanRight,"active");
                removeClass(spanLeft,"active");
            }


        })
    };
    return {
        init: function () {
            queryData.then(clickEvent).then(bindHTML).then(handleArrow);
        }
    }
})();
movieRender.init();

//左边框动态绑定
$(function ($) {
    let barRender = function () {
        let data = null,
            $leftBanner = $(".category-nav-content-wrapper"),
            $ul = $(".category-nav-content-wrapper>ul"),
            $lis = $ul.find("li"),
            $bar = $(".header-bar");

        //header-bar 的展示与隐藏
        let headerBar = function () {
            $ul = $(".category-nav-content-wrapper>ul");
            $(document.body).mouseover(function (e) {
                let target = e.target;

                let flag1 = $(target).parents().filter(".category-nav-content-wrapper>ul").length>0?true:false;
                let flag2 = $(target).parents().filter(".header-bar").length>0?true:false;

                if(flag1||target === $(".header-bar")[0]||flag2){
                    $bar.stop().css("display","block");
                    return;
                }
                $bar.stop().css("display","none");
            });
        };

        let getData = function () {
            return new Promise(resolve=>{
                $.ajax({
                    url:"json/bar.json",
                    method:"get",
                    async:"true",
                    dataType:"json",
                    success:resolve
                });
            });


        };

        let bindHTML = function (data) {
            let strLeft=``;

            //left数据 绑定
            data.forEach((item,index)=>{
                let strSpan = ``;
                item["leftPcHomeCategoryList"].forEach((item,index)=>{
                    if(index){
                        strSpan+=`<i class="iconfont icon-xiexian"></i>`;
                    }
                    strSpan+=`<span class="nav-text-wrapper">${item["name"]}</span>`;
                });
                strLeft+=`
                            <li class="nav-li"><i class="iconfont ${item["leftPcHomeCategoryList"][0]["iconfont"]}"></i><span class="nav-text-wrapper">${strSpan}</span><i class="nav-right-arrow"></i></li> `;
            });
            $(strLeft).appendTo($ul);

            //right数据绑定
            $lis = $ul.find("li");
            $lis.mouseover(function () {
                let strRight=``;
                let strRightInner = ``;
                $(".header-bar")[0].innerHTML="";

                data[$(this).index()]["rightPcHomeCategoryList"].forEach((item,index)=>{
                    let ary = [];
                    let strA = ``;
                    let strTitle = ``;
                    item.forEach((item,index)=>{
                        let every = item["name"];
                        strTitle += index===0?`<a class ="title">${every}</a>`:``;
                        strA+=index>0?`<a>${every}</a>`:``;
                    });
                    // console.log(strTitle,strA);
                    strRightInner+= `<div class="detail-title"><div class="bigFont clearfix"><h2>${strTitle}</h2><a class="more">更多></a></div>
</div><div class="detail-content">${strA}</div>`;
                });
                $(strRightInner).appendTo($(".header-bar"));

            }) ;
        };

        return {
            init:function () {
                let promise = getData();
                promise.then(bindHTML).then(()=>{headerBar()});
            }
        }
    }();
    barRender.init();
});

//轮播图动态绑定
$(function($){
    let bannerRender = function () {

        let data = null,
            $wrapper = $(".wrapper"),
            $focus = $(".focus").children();
        $imgList = null,
            $focusList = null,
            $arrow = $(".arrow"),
            $arrowLeft = $arrow.eq(0),
            $arrowRight = $arrow.eq(1);



        let step = 0,
            lastStep = 0;
        timer = null;

        let getData =  () => {
            return new Promise((resolve)=>{
                $.ajax({
                    url:"json/banner.json",
                    method:"get",
                    async:"true",
                    dataType:"json",
                    success:(result)=>{
                        data = result;
                        resolve(data);
                    }
                });
            })

        } ;

        let bindHTML = (data)=>{
            let str=``;
            let focusStr = ``;
            data.forEach((item,index)=>{
                let {img,desc,link} = item;
                str+= `<div class="pic"><a href="${link}"><img src="${img}" alt="${desc}"></a></div>`;
                focusStr += `<li style="opacity: ${index===0?1:0.6}"></li>`;
            })
            $wrapper.append(str);
            $focus.append(focusStr);
            $imgList = $(".pic");
            $focusList = $(".focus").find("li");
            $($imgList[0]).css("display","block");
        };

        let autoMove = ()=>{
            step++;
            if(step>=$imgList.length){
                step=0;
            }
            $($imgList[step]).stop().fadeIn(500);
            $($imgList[lastStep]).stop().fadeOut(500);
            focusMove();
            lastStep = step;
        };

        let focusMove = ()=>{
            $($focusList[step]).css("opacity","1");
            $($focusList[lastStep]).css("opacity","0.6");
        };

        let mouseContorl = ()=>{
            $wrapper.mouseover (()=>{
                $arrowLeft.add($arrowRight).css("display","block");
                clearInterval(timer);
            });
            $wrapper.mouseout(()=>{
                $arrowLeft.add($arrowRight).css("display","none");
                timer= setInterval(autoMove,2000);
            });
        };

        let focusContorl = () =>{
            $.each($focusList,(index,item)=>{
                $(item).mouseover(()=>{
                    $($imgList[index]).stop().fadeIn(500);
                    $($imgList[step]).stop().fadeOut(500);
                    $($focusList[index]).css("opacity","1");
                    $($focusList[step]).css("opacity","0.6");
                    step = index;
                })
            });
        };

        let arrowContorl = () =>{
            $arrowRight.click(autoMove);
            $arrowLeft.click(()=>{
                step--;
                if(step<0){
                    step=$imgList.length-1;
                }
                $($imgList[step]).stop().fadeIn(500);
                $($imgList[lastStep]).stop().fadeOut(500);
                focusMove();
                lastStep = step;
            });
        }


        return {
            init:function () {
                let promise = getData();
                promise.then((data)=>{
                    bindHTML(data);
                    timer = setInterval(autoMove,2000);
                    mouseContorl();
                    focusContorl();
                    arrowContorl();
                })

            }
        }
    }();
    bannerRender.init();
});

//picture动态绑定
$(function () {
    let picRender = function () {
        let data = null;
        // let $pic1=$(".pic-1");

        let getData = function () {
            return new Promise((resolve)=>{
                $.ajax({
                    url:"json/pic.json",
                    method:"get",
                    async:"true",
                    dataType:"json",
                    success:resolve
                });
            })

        };
        let bindHTML = function (data) {
            for(let i=0;i<data.length;i++){
                let str=`<a href="${data[i]['href']}"><img src="${data[i]['url']}"></a>`;
                $(`.pic-${i+1}`).html(str);
            }
        };


        return {
            init:function () {
                let promise = getData();
                promise.then(bindHTML)

            }
        }
    }();
    picRender.init();
});

/*discount*/
~function () {
    let discount = document.querySelector('.discount'),
        discount_top = discount.querySelector('.discount-top'),
        discount_bottom = discount.querySelector('.discount-bottom'),
        divList=discount_bottom.querySelectorAll('div'),
        tBox = discount_top.querySelector('.tBox'),
        liList=tBox.querySelectorAll('li'),
        bStyle = tBox.querySelectorAll('b'),
        aBox = discount_bottom.querySelector('.aBox'),
        data=null;
    //获取数据
    let queryData = function () {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'json/meituan-1.json',false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);
    };
    queryData();


    //绑定数据

    //     let bindData=function (data) {
//         let ul = document.querySelectorAll('.discount-bottom>div>ul');
//
//         for (let i = 0; i < data.length; i++) {
//             let str=``;
//             let item=data[i];
//             for (let j = 0; j < item.length; j++) {
//                 let obj = item[j],
//                 {pic,title,desc,price,old,sold}=obj;
//                 str+=`<li><a href="javascript:;">
// <img src="${pic}" alt="" class="clearfix">
//                                     <h3>${title}</h3>
//                                     <h4>${desc}</h4>
//                                     <h4></h4>
//                                     <span>${price}</span>
//                                     <span>${old}</span>
//                                     <span>${sold}</span>
//                                 </a>
//                             </li>`;
//             }
//             ul[i].innerHTML=str;
//         }
//     };
    let bindData=function (data) {
        let ul = document.querySelectorAll('.discount-bottom>div>ul');
        data.forEach((item,index)=>{
            let str=``;
            item.forEach((item,index)=>{
                let  {pic,title,desc,price,old,sold}=item;
                str+=`<li><a href="javascript:;">
<img src="${pic}" alt="" class="clearfix">
                                    <h3>${title}</h3>
                                    <h4>${desc}</h4>
                                    <h4></h4>
                                    <span>${price}</span>
                                    <span>${old}</span>
                                    <span>${sold}</span>
                                </a>
                            </li>`;
            });
            ul[index].innerHTML=str;
        });
//         for (let i = 0; i < data.length; i++) {
//             let str=``;
//             let item=data[i];
//             for (let j = 0; j < item.length; j++) {
//                 let obj = item[j],
//                     {pic,title,desc,price,old,sold}=obj;
//                 str+=`<li><a href="javascript:;">
// <img src="${pic}" alt="" class="clearfix">
//                                     <h3>${title}</h3>
//                                     <h4>${desc}</h4>
//                                     <h4></h4>
//                                     <span>${price}</span>
//                                     <span>${old}</span>
//                                     <span>${sold}</span>
//                                 </a>
//                             </li>`;
//             }
//             ul[i].innerHTML=str;
//         }
    };
    bindData(data);

    //绑定循环事件：鼠标滑过每一个li下面对应的内容显示
    let visit=function () {
        let pre=0;
        liList.forEach((item,index)=>{
            if(index===0)return;
            item.onmouseover=function () {
                bStyle[pre].className=divList[pre].className='';
                bStyle[index-1].className=divList[index-1].className='active';
                pre=index-1
            }
        })
    }();

}();
/*food*/
let food = (function () {
    let container = document.querySelector('.container'),
        index = container.querySelector('.index'),
        food = index.querySelector('.food'),
        conBox = food.querySelector('.conBox'),
        list = null;
    let setData = function () {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'json/food.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);

    };
    let bindHTML = function () {
        let str = ``;
        data.forEach((curL, index) => {
            let {img, shop, pingJ, site, price, link,width} = curL;
            str += `      <li class="list" >
                    <a href="${link}" target="_blank">
                    <img src="${img}" alt="">
                    <h4>${shop}</h4>
                    <div class="star">
                        <ul class="garyStar">
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                        </ul>
                        <ul class="yellowStar" style="width: ${width}">
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                            <li><i class="icon iconfont icon-xingxing"></i></li>
                        </ul>

                    </div>
                        <span class="evaluate">${pingJ}</span>
                    <span>${site}</span>
                    <p>${price}</p>
                    </a>
                    </li>`;
        });
        conBox.innerHTML = str;
        list = conBox.querySelectorAll('li');

    };
    let mouseActive = function () {
        [].forEach.call(list,(item,index)=>{
            item.onmouseenter=function () {
                item.className+=' active';
            };
            item.onmouseleave=function () {
                item.className= item.className.replace('active','');
            };
        })
    };
    return {
        init: function () {
            setData();
            bindHTML();
            mouseActive();
        }
    }
})();
food.init();
/*homeStay*/
let homeStayRender = (function () {


    let $homeStay = $('.homeStay'),
        $liList = $('.options>li'),
        $divBox = $homeStay.find('.divBox'),
        $imgBox = $divBox.find('.imgBox'),
        $imgList = null;
    let getData = function getData() {
        return new Promise(resolve => {
            $.ajax({
                url: 'json/homeStay.json',
                dataType: 'json',
                success: resolve

            })
        })
    };
    let bindHTML = function bingHTML(data) {

        $imgBox.each((index, curD) => {

            let item = data[index];

            if (!item) return;
            let {title, desc1, desc2, desc3, price, img} = item;
            let $toHtml = $(`<img src="" data-src="${img}" alt="" class="product-img">
                    <i class="head-img"></i>
                    <div class="product-info">
                        <p>${title}</p>
                        <p><span>${desc1}</span><span>${desc2}</span><span>${desc3}</span></p>
                        <p>￥${price}</p>
                    </div>`);

            $toHtml.appendTo($(curD));
        });
        $imgList = $imgBox.find('img');
    };
    let lazyImg = curImg => {
        let $curImg = $(curImg),
            trueImg = $curImg.attr('data-src');
        let tempImg = new Image();
        tempImg.onload = () => {
            $curImg.attr('src', trueImg).stop().fadeIn(10000);
            tempImg = null;
            curImg.isLoad = true;
        };
        tempImg.src = trueImg;
    };
    let computedImg = () => {
        $imgList = $imgBox.find('img');
        $imgList.each((index, curImg) => {
            // if (!curImg) return;
            let $curImg = $(curImg),
                A = $imgBox.offset().top + $imgBox.outerHeight(),
                B = document.documentElement.scrollTop + document.documentElement.clientHeight;
            if (A <= B) {
                if (curImg.isLoad) {
                    return;
                }
                lazyImg(curImg);
            }

        });

    };
    let change = function change() {
        // computedImg();
        let changeList = $liList.get().slice(1,$liList.length-1),
            $iList = $(changeList).find('i');
        let lastIndex = 0;
        $(changeList).each((index, item) => {
            item.onmouseover = function anonymous() {
                if (lastIndex === index) return;
                $(item).addClass('active');
                $divBox.eq(index).addClass('active');
                $iList.eq(index).addClass('active');
                $(changeList).eq(lastIndex).removeClass('active');
                $divBox.eq(lastIndex).removeClass('active');
                $iList.eq(lastIndex).removeClass('active');
                lastIndex = index;
            }

        })


    };


    return {
        init: function () {
            let promise = getData();
            promise.then((data) => {
                bindHTML(data);
                $(window).on('scroll', computedImg);
            }).then(change);
        }
    }
})();
homeStayRender.init();
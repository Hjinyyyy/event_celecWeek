/* 토글 */
function toggle_view(selector, obj){
    var search = $('#'+selector+'');
    var obj = $(obj);
    if (search.css('display') == 'none') {
        search.show();
        obj.addClass('active');
    } else {
        search.hide();
        obj.removeClass('active');
    }
}
/* 탭뷰 */
function tabover(name, no) {
    var tabs = $('.tab_'+name+'').find('li');
    tabs.each(function(idx) {
        var detail = $('.tabcnt_'+name+idx);
        var link = $(this).find('a');
        if(no == idx) {
            detail.show();
            link.addClass('active');
            autoResize(detail.children()[0]);
        } else {
            detail.hide();
            link.removeClass('active');
        }
    });

}

/* 스크롤 이동 */
$(window).scroll(function(){
    var y=$(this).scrollTop();
    if( y > 300 ){
        $('.btn_scroll').fadeIn();
    } else {
        $('.btn_scroll').fadeOut();
    }
    /*header addClass fixed*/
    if( y > 100 ){
        $('header').addClass('fixed is_fix');
    } else {
        $('header').removeClass('fixed is_fix');
    }
});
function scrollup(){
    $('html, body').animate({scrollTop:0}, 'slow');
}
function scrolldown(){
    $('html, body').animate({scrollTop:$(document).height()}, 'slow');
}

//lnb 카테고리 on
function onCate(no) {
    $('.lnb .cate_child.sub_'+no).show();
    $('.lnb .big_'+no).addClass('active');
}
//lnb 카테고리 off
function offCate(no) {
    $('.lnb .cate_child.sub_'+no).hide();
    $('.lnb .big_'+no).removeClass('active');
}

//뒤로가기
function pageBack() {
    history.back();
}

//랜덤 쿠폰 배열
var coupon_array = new Array('5', '10' ,'15' , '30', '50');
var i = 0;

function numberCounter(target_frame, target_number) {
    this.count = 0; this.diff = 0;
    this.target_count = parseInt(target_number);
    this.target_frame = document.getElementById(target_frame);
    this.timer = null;
    this.counter();
};

numberCounter.prototype.counter = function() {

    var self = this;
    this.diff = this.target_count - this.count;

    if(this.diff > 0) {
        self.count += Math.ceil(this.diff / 5);
    }
    if(this.diff == this.target_count){
        this.target_frame.innerHTML = "??%";
    }else{
        this.target_frame.innerHTML = this.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')+"%";
    }
    //coupon_array에 담긴 숫자보다 적을경우
    if(this.count < this.target_count) {
        //숫자 카운트 속도
        this.timer = setTimeout(function() { self.counter(); }, 50);
    } //array에 값이 일치하면 다시 함수 재실행
    else {
        i++;
        clearTimeout(this.timer);
        if(i == 5) i = 0;
        setTimeout(function() { new numberCounter("CountCon", coupon_array[i]); }, 1000);
    }
};

function coupon_issued(){
    $.ajax({
        url: "/ajax/cpn.php",
        success: function(data) {
            if(data){
                var dataArray = "";
                if(data.length == 3){
                    alert(coupon_ajax_code(data));
                    if(data == '101'){
                        window.location = "/member/login.php";
                    }
                }else{
                    dataArray = data.split("@@");
                    var coupon_persent = dataArray[0];
                    var coupon_min = dataArray[1];
                    var coupon_max = dataArray[2];
                    var obj = $('.event_pop_up');
                    $(".discountRate").html(coupon_persent);
                    $(".notice_area .minPrice").html(coupon_min);
                    $(".notice_area .maxPrice").html(coupon_max);
                    $(".event_pop_up").css({
                        "position" : "absolute",
                        "top": (($(window).height() - obj.outerHeight()) / 2  + $(window).scrollTop()) ,
                        "left": (($(window).width()- obj.outerWidth()) / 2 + $(window).scrollLeft()),
                        "z-index" : "2"
                    });
                    $("#event_pop_mask").css({"width":$(window).width(),"height":$(document).height()});
                    $("#event_pop_mask").fadeIn(0);
                    $(".event_pop_up").show();
                }
            }else{
                alert(coupon_ajax_code(data));
                return false;
            }
        }
    });
}

function coupon_ajax_code(dataCode) {
    var msg_comment = "";
    switch (dataCode) {
        case "100" : msg_comment = "쿠폰 발급기간이 아닙니다.";
            break;
        case "101" : msg_comment = "로그인 후 이용 가능합니다.";
            break;
        case "102" : msg_comment = "이미 발급된 쿠폰이 존재합니다.";
            break;
        case "103" : msg_comment = "쿠폰 발급이 실패하였습니다.";
            break;
        default : msg_comment = "쿠폰 발급이 실패하였습니다.";
            break;
    }
    return msg_comment;
}

//lnb 메뉴 실행 (스와이프)
function lnbRun(no) {
    if($('.lnb').css('display') == 'none' || $('.lnb').length < 1) return;
    if(no) $('.lnb .swiper-slide.cate_'+no).addClass('selected');
    var lnbStartNo = ( $('.lnb .swiper-wrapper .swiper-slide.selected').length > 0 )? $('.lnb .swiper-wrapper .swiper-slide.selected').index() : 0;
    var lnbSwiper = new Swiper('.lnb .swiper-container', {
        initialSlide: lnbStartNo,
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 0,
        loop: false,
    });

}

function autoResize(obj){
    var newheight;
    var newwidth;

    if(obj.contentDocument){
        newheight = obj.contentDocument.documentElement.scrollHeight;
    } else {
        newheight=obj.contentWindow.document.body.scrollHeight;
    }

    obj.height= newheight + "px";
}

function toggle_search() {
    $('#search_layer').fadeToggle(400);
}

function scrollToBlock(id){
    var headerHegiht = document.querySelector(".lnb").offsetHeight;
    var offsetTop = document.querySelector("#"+id).offsetTop;
    window.scrollTo({top:offsetTop - headerHegiht});
}

$(document).ready(function(){
    new numberCounter("CountCon", coupon_array[0]);

    $(".coupon_button").click(function(){
        coupon_issued();
    });

    $(".coupon_layer_btn").click(function(){
        $("#event_pop_mask").hide();
        $(".event_pop_up").hide();
    });
    if(/Mobile/.test(navigator.userAgent) == true){
        //모바일
        lnbRun();
    }
});

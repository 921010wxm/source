/**
 * 分页插件
 * @Author: Mavinbin(186905)
 * @Editor: Mavinbin(186905)
 * @Date: 2016-12-15
 *
 **/
!(function($){
    $.fn.pagiantion = function(options){
        var defaults = {
            itemsTotal: 0,                  //整数值, 数据总个数
            perPageLen: 10,                 //整数值, 每页显示数据个数
            midPageLen: 5,                  //整数值, 中间页码显示个数
            defaultPage: 1,                 //整数值, 默认显示第几页数据
            isShowFirstLastPage: true,      //布尔值，是否显示首页和尾页
            isShowSidePage: true,           //布尔值, 是否显示两边的页码（带省略号）
            sidePageLen: 1,                 //整数值, 两边页码最多显示几个
            firstPageCls: 'first',          //字符串，首页类名
            lastPageCls: 'last',            //字符串, 尾页默认类名
            prevPageCls: 'prev',            //字符串, 上一页类名
            nextPageCls: 'next',            //字符串, 下一页类名
            activeCls: 'on',                //字符串, 页码选中样式
            pageCls: '',                    //字符串，数字页码样式
            firstPageTxt: '<<',             //字符串, 首页文本
            lastPageTxt: '>>',              //字符串, 尾页文本
            prevPageTxt: '<',               //字符串, 上一页文本
            nextPageTxt: '>',               //字符串, 下一页文本
            firstPageTit: '首页',            //字符串, 首页title
            lastPageTit: '尾页',             //字符串, 尾页title
            prevPageTit: '上一页',           //字符串, 上一页title
            nextPageTit: '下一页',           //字符串, 下一页title
            onReady: null,                  //函数, 插件准备完毕后的回调函数
            onClick: null                   //函数, 点击分页后的回调函数
        };

        var options = $.extend({}, defaults, options);

        return this.each(function(){
            var $this = $(this),
                curPage = options.defaultPage,
                midStartPage = 1, //中间分页起始页码
                midEndPage = 1,   //中间分页结尾页码
                maxPage = 1;      //最大页码

            if(options.itemsTotal > 0 && options.perPageLen > 0 && options.midPageLen > 0){

                //最大页码=总条目数/每页显示条目数，如果有余数则总页码需要再加1
                maxPage = parseInt(options.itemsTotal / options.perPageLen) + (options.itemsTotal % options.perPageLen === 0 ? 0 : 1);

                //计算并写入分页
                function calcAndInsertPage(){
                    var str = '';

                    //中间分页起始页码=当前页码-（中间页码个数 / 2），如果设置中间页码的个数没有余数则+1（即在偶数个数情况下，使当前页更靠左，比如 1 【2】 3 4）
                    midStartPage = curPage - parseInt(options.midPageLen / 2) + (options.midPageLen % 2 === 0 ? 1 : 0);

                    //中间分页结尾页码=当前页码+（中间页码个数 / 2）
                    midEndPage = curPage + parseInt(options.midPageLen / 2);

                    //如果中间分页起始页码小于1，则将中间分页起始页码小于1的部分所占个数补给中间分页结尾页码，以保证中间分页显示个数不变
                    if(midStartPage < 1){
                        midEndPage = midEndPage - midStartPage + 1;
                    }

                    //如果中间分页结尾页码大于1，则将中间分页结尾页码大于1的部分所占个数补给中间分页起始页码，以保证中间分页显示个数不变
                    if(midEndPage > maxPage){
                        midStartPage = midStartPage - (midEndPage - maxPage);
                    }

                    //中间分页起始页码如果小于1,则变为1，否则不变
                    midStartPage = midStartPage > 0 ? midStartPage : 1;

                    //中间分页结尾页码如果大于最大页码,则变为最大页码，否则不变
                    midEndPage = midEndPage < maxPage ? midEndPage : maxPage;

                    //如果设置了首/尾页显示、最大页码大于1且当前页码大于1，则显示首页按钮
                    if(options.isShowFirstLastPage && maxPage > 1 && curPage > 1){
                        str += '<a class="' + options.firstPageCls + '" href="javascript:;" title="' + options.firstPageTit + '" data-tag="first">' + options.firstPageTxt + '</a>';
                    }

                    //最大页码数大于1且当前页码大于1时显示上一页按钮
                    if(maxPage > 1 && curPage > 1){
                        str += '<a class="' + options.prevPageCls + '" href="javascript:;" title="' + options.prevPageTit + '" data-tag="prev">' + options.prevPageTxt + '</a>'
                    }

                    //设置的两边页码显示个数大于0时执行
                    if(options.sidePageLen > 0){
                        var sideLeftEndPage = options.sidePageLen; //左侧分页结尾页码
                        sideLeftEndPage = sideLeftEndPage < midStartPage ? sideLeftEndPage : midStartPage - 1; //左侧分页结尾页码如果大于或者等于中间分页的起始页码，则变为中间分页的起始页码减1（即左侧分页结尾页码一定要比中间分页的起始页码小）

                        //左侧分页
                        for(var i = 1; i <= sideLeftEndPage; i++){
                            str += '<a class="' + options.pageCls + '" href="javascript:;" title="' + i + '">' + i + '</a>';
                        }

                        //如果中间起始页码和左侧分页的结尾页码的差值大于1，则显示省略号
                        if(midStartPage - sideLeftEndPage > 1){
                            str += '<span style="font-size: 18px;">...</span>';
                        }
                    }

                    //中间分页
                    for(var j = midStartPage; j <= midEndPage; j++){
                        if(j === curPage){
                            var cls = options.pageCls ? options.pageCls + ' ' + options.activeCls : options.activeCls;
                            str += '<a class="' + cls + '" href="javascript:;" title="' + j + '">' + j + '</a>';
                        }else{
                            str += '<a class="' + options.pageCls + '" href="javascript:;" title="' + j + '">' + j + '</a>';
                        }
                    }

                    //设置的两边页码显示个数大于0时执行
                    if(options.sidePageLen > 0){
                        var sideRightStartPage = maxPage - options.sidePageLen + 1;//右侧分页起始页码
                        sideRightStartPage = sideRightStartPage > midEndPage ? sideRightStartPage : midEndPage + 1;//右侧分页起始页码如果小于或者等于中间分页的结尾页码，则变为中间分页的结尾码加1（即右侧分页起始页码一定要比中间分页的结尾页码大）

                        //如果中间起始页码和右侧分页的起始页码的差值大于1，则显示省略号
                        if(sideRightStartPage - midEndPage > 1){
                            str += '<span style="font-size: 18px;">...</span>';
                        }

                        //右侧分页
                        for(var k = sideRightStartPage; k <= maxPage; k++){
                            str += '<a class="' + options.pageCls + '" href="javascript:;" title="' + k + '">' + k + '</a>';
                        }
                    }

                    //最大页码大于1且当前页码小于最大页码时显示下一页按钮
                    if(maxPage > 1 && curPage < maxPage){
                        str += '<a class="' + options.nextPageCls + '" href="javascript:;" title="' + options.nextPageTit + '" data-tag="next">' + options.nextPageTxt + '</a>'
                    }

                    //如果设置了首/尾页显示、最大页码大于1且当前页码小于最大页码，则显示尾页按钮
                    if(options.isShowFirstLastPage && maxPage > 1 && curPage < maxPage){
                        str += '<a class="' + options.lastPageCls + '" href="javascript:;" title="' + options.lastPageTit + '" data-tag="last">' + options.lastPageTxt + '</a>';
                    }

                    //写入分页到dom中
                    $this.html(str);
                }

                calcAndInsertPage();

                //如果设置了onReady函数，则执回调
                if(options.onReady !== null && typeof options.onReady === 'function'){
                    options.onReady(curPage, options.perPageLen, options.itemsTotal);
                }

                $this.off('click', 'a');

                //点击分页执行操作
                $this.on('click', 'a', function(){
                    switch ($(this).attr('data-tag')){
                        case 'first':
                            curPage = 1;            //点击首页，当前页码变为1
                            break;

                        case 'prev':
                            curPage --;             //点击上一页，当前页码减1
                            break;

                        case 'next':
                            curPage ++;             //点击下一页，当前页码加1
                            break;

                        case 'last':
                            curPage = maxPage;      //点击首页，当前页码变为最大页码
                            break;

                        default:
                            if(!$(this).hasClass(options.activeCls)){ //如果当前页吗未选中，则点击后当前页码变为元素的文本数字
                                curPage = parseInt($(this).text());
                            }
                    }

                    calcAndInsertPage();

                    //如果设置了onClick函数，则执回调
                    if(options.onClick !== null && typeof options.onClick === 'function'){
                        options.onClick(curPage, options.perPageLen, options.itemsTotal);
                    }
                });
            }
        });
    };
})(jQuery);
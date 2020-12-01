$(function () {
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 3, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // console.log(res);
                let htmlStr = template('tpl-table', res);
                $('.layui-table tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    initTable();

    //定义时间美化过滤函数
    template.defaults.imports.dataFormat = function (date) {
        const data = new Date(date);

        let y = data.getFullYear();
        let m = padZero(data.getMonth() + 1);
        let d = padZero(data.getDate());
        let h = padZero(data.getHours());
        let ms = padZero(data.getMinutes());
        let s = padZero(data.getSeconds());

        return y + '-' + m + '-' + d + ' ' + h + ':' + ms + ':' + s;
    }

    // 时间补0函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    initCate();

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=status]').val();
        console.log(cate_id);
        q.cate_id = cate_id;
        q.state = state;

        initTable();
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 页面显示数据条数
            curr: q.pagenum, // 当前处在哪一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],
            // 方式1.点击页码的时候会触发 jump 的回调
            // 方式2.只要调用了 laypage.render() 方法就会触发jump回调
            jump: function (obj, first) {
                //可以通过 first 来判断当前jump是怎么被触发调用的
                //如果 first 为 true 则是以方式2 调用的 为undefined 是以方式1调用的
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); // 得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                if (!first) {
                    initTable();
                }
            }
        });
    }

    //删除功能
    $('body').on('click', '.btn-del', function () {
        let len = $('.btn-del').length;
        let id = $(this).data('id');
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message);
                    layer.msg('删除成功！');

                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum--;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})
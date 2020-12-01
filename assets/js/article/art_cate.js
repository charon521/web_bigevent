$(function () {
    initArtCateList();

    //获取分类数据 渲染到页面中
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message);
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '240px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //点击添加类别
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message);
                initArtCateList()
                layui.layer.msg('新增分类成功！');
                layui.layer.close(indexAdd);
            }
        })
    })

    //点击编辑分类 弹框 获取数据渲染表单
    let indexEdit = null;
    $('body').on('click', '.btn-edit', function () {
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '240px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        })
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + $(this).attr('data-id'),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message);
                // console.log(res);
                // layui.form.val('form-edit', res.data);
                $('#form-edit input[name=Id]').val(res.data.Id);
                $('#form-edit input[name=name]').val(res.data.name);
                $('#form-edit input[name=alias]').val(res.data.alias);
            }
        })
    })

    //点击提交表单数据 渲染到页面中
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message);
                layui.layer.msg('修改成功！');
                initArtCateList();
                layui.layer.close(indexEdit);
            }
        })
    })

    //点击删除 弹框
    $('body').on('click', '.btn-del', function () {
        let id = $(this).siblings('.btn-edit').attr('data-id');
        layui.layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) return layui.layer.msg(res.message)
                    layui.layer.msg('删除成功！');
                    initArtCateList();
                }
            })
            layer.close(index);
        });
    })
})
$(function () {
    let layer = layui.layer;
    let form = layui.form;

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    initCate();
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function (e) {
        // console.log(e.target.files[0]);
        let fileList = e.target.files;
        if (fileList.length === 0) {
            return layer.msg('请选择一张图片！');
        }
        // 将图片文件转化为路径
        let imgUrl = URL.createObjectURL(fileList[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    let article_status = '已发布';
    $('#btnSave2').on('click', function () {
        article_status = '草稿';
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        let fd = new FormData($(this)[0]);
        fd.append('state', article_status);

        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob);
            publishArticle(fd);
        });
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('操作成功！');
                setTimeout(function () {
                    location.href = '/article/art_list.html';
                }, 1000)
            }
        })
    }
})
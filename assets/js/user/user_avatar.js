$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    });

    //为文件上传控件绑定change事件
    $('#file').on('change', function (e) {
        let fileList = e.target.files;
        if (fileList.length === 0) {
            return layui.layer.msg('请选择图片！');
        }
        // 1. 拿到用户选择的文件
        let file = fileList[0];
        // 2. 将文件，转化为路径
        let imgUrl = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    $('#btnSure').on('click', function () {
        let dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') //转化为base64格式的字符串

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message);
                layui.layer.msg('更换头像成功！');
                window.parent.getUserInfo();
            }
        })
    })
})
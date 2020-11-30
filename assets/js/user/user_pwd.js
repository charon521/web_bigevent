$(function () {
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samepwd: function (value) {
            if ($('input[name=oldpwd]').val() === value) {
                return '新旧密码不能相同';
            }
        },
        repwd: function (value) {
            if ($('input[name=newpwd]').val() !== value) {
                return '两次密码输入不一致';
            }
        }
    });

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message);
                layui.layer.msg('密码修改成功！');
                $('.layui-form')[0].reset();
            }
        })
    })
})
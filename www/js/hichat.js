var __users = [];
var __info;
var chat;
var index;
var billId;
window.onload = function() {
    $.ajax({
        type: 'GET',
        url: '/api/info',
        // async:true,
        success: function(data) {
            if (data.succ !== 0) {
                window.location.href = '/login.html';
                return;
            }
            __info = data;
            $("#userddd").text(__info.display);
            if (__info.group == 0) {
                $(".dropdown-menu").find('li').eq('0').remove();
                $(".dropdown-menu").find('li').eq('0').remove();
                $(".dropdown-menu").find('li').eq('0').remove();
            };
            if (__info.group >= 95 && __info.group <= 99) {
                $("#sendBtn").parent().append("<button class='btn btn-primary' id='ding'>行情提醒</button>")
                $(".dropdown-menu").append('<li class="divider"></li><li><a href="/htgl/admin.html">后台管理中心</a></li>')
                $("#sendBtn").parent().append("<button class='btn btn-primary' id='callbill' data-toggle='modal' data-target='#myModal'>喊单</button>");
                $("#callbill").click(function(event) {
                    console.log("click!");
                    $.ajax({
                            url: '/api/category',
                            type: 'GET',
                            dataType: 'json',

                        })
                        .done(function(data) {
                            console.log("success", data);
                            for (var i = 0; i < data.length; i++) {
                                // console.log($("input[name='pro']").eq(i).text());
                                $("#pro").append("<input type='radio' name='pro' value=''><span></span>");
                                $("input[name='pro']").next('span').eq(i).text(data[i].name);
                                $("input[name='pro']").eq(i).val(data[i].name).text(data[i].name);
                                // console.log($("input[name='pro']:checked").val());
                            }

                            $("input[name='pro']").click(function(event) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].name == $(this).val()) {
                                        index = i;
                                    }

                                };
                                console.log(index);
                                $("#billtype").find('input').remove();
                                $("#billtype").find('span').remove();
                                for (var j = 0; j < data[index].products.length; j++) {
                                    console.log(data[index].products);

                                    $("#billtype").append("<input type='radio' name='billtype' value='" + data[index].products[j] + "'><span>" + data[index].products[j] + "</span>");
                                    // $("input[name='billtype']").next('span').eq(j).text(data[index].products[j]);
                                    // console.log(data[index].products);
                                    // $("input[name='billtype']").eq(j).val(data[index].products[j]);
                                    console.log($("input[name='billtype']").eq(j).val());
                                };
                            });
                            console.log(data);



                        })
                        .fail(function() {
                            console.log("error");
                        })
                        .always(function() {
                            console.log("complete");
                        });

                });
            };
            if (__info.group >= 90 && __info.group < 95) {
                $("#sendBtn").parent().append("<button class='btn btn-primary' id='ding'>行情提醒</button>")
            };
            if (__info.group >= 50 && __info.group <= 89) {
                $("#sendBtn").parent().append("<button class='btn btn-primary'>提问</button>")
            }

            var hichat = new HiChat();
            hichat.init();

        }
    });

};

function chatTo(id, name) {
    chat = id;
    console.log(chat);
    $("#schat").text(name);
}

function schatTo(id, name) {
    $("#schat").text(name);
    chat = id;
}

function opera_finnish() {

    $("#pingcang").css('display', 'block');
    $("#zengcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#deal").css('display', 'none');

}

function opera_add() {

    $("#pingcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#deal").css('display', 'none');

    $("#zengcang").css('display', 'block');

}

function opera_reduce() {
    $("#jiancang").css('display', 'block');
    $("#pingcang").css('display', 'none');
    $("#zengcang").css('display', 'none');
    $("#deal").css('display', 'none');

}

function opera_deal() {
    $("#deal").css('display', 'block');
    $("#pingcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#zengcang").css('display', 'none');

}

function opera_cancel(id) {


}

$('#billtable>tbody').on('click', '.btn-warning', function(e) {
    // e.preventDefault();
    if (confirm("确定要删除该属性？")) {
        var table = $('#billtable').DataTable();
        var id = $(this).attr('id');
        console.log("id:", id);
        table.row($(this).parents('tr')).remove().draw(false);
        $.ajax({
                url: '/api/bill/' + id,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: "cancel"
                },
            })
            .done(function() {
                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });

    }

});
$("#billtable>tbody").on('click', 'tr', function(event) {
    // event.preventDefault();
    console.log($(this)[0].cells[6].innerHTML);
    $("input[name='checkUpPrice']").val($(this)[0].cells[6].innerHTML);
    $("input[name='checkLowPrice']").val($(this)[0].cells[7].innerHTML);
    $("input[name='openPrice']").val($(this)[0].cells[4].innerHTML);
    billId = $(this)[0].cells[0].innerHTML;
});
// $("#ping_checkUp").click(function(event) {
//     var checkUpPrice = $("input[name='checkUpPrice']").val();
//     $.ajax({
//             url: '/api/bill/'+billId,
//             type: 'POST',
//             dataType: 'json',
//             data: {
//                 operation: 'finnish',
//                 checkUpPrice: checkUpPrice,
//                 id: billId
//             },
//         })
//         .done(function(data) {
//             console.log("success",data);
//             $("")


//         });

// });
$('#billtable>tbody').on('click', '.btn-danger', function(e) {
    // e.preventDefault();
    var that = this;
    $("#ping_checkUp").unbind('click').click(function(event) {
        var checkUpPrice = $("input[name='checkUpPrice']").val();

        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'finnish',
                    checkUpPrice: checkUpPrice,
                    id: billId
                },
            })
            .done(function(data) {
                console.log("success", data);
                var table = $('#billtable').DataTable();
                table.row($(that).parents('tr')).remove().draw(false);

            });

    });
    $("#ping_checkLow").unbind('click').click(function(event) {
        var checkLowPrice = $("input[name='checkLowPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'finnish',
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function() {
                console.log("success");
                var table = $('#billtable').DataTable();
                table.row($(that).parents('tr')).remove().draw(false);

            });

    });

});
$("#billtable>tbody").on('click', '.sub', function(event) {
    var that = this;
    $("#jian_checkUp").unbind('click').click(function(event) {
        var checkUpPrice = $("input[name='checkUpPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'reduce',
                    checkUpPrice: checkUpPrice,
                    id: billId
                },
            })
            .done(function(data) {
                console.log("jian_checkUp success", data);
                var table = $('#billtable').DataTable();
                table.row($(that).parents('tr')).remove().draw(false);


            });

    });
    $("#jian_checkLow").unbind('click').click(function(event) {
        var checkLowPrice = $("input[name='checkLowPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'reduce',
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function(data) {
                console.log("jian_checkLow success", data);

                var table = $('#billtable').DataTable();
                table.row($(that).parents('tr')).remove().draw(false);

            });

    });

});
$("#billtable>tbody").on('click', '.add', function(event) {
    var that = this;
    $("#zeng_submit").unbind('click').click(function(event) {
        var openPrice = $("input[name='openPrice']").val();
        var checkLowPrice = $("input[name='checkLowPrice']").val();

        var checkUpPrice = $("input[name='checkUpPrice']").val();

        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'add',
                    openPrice: openPrice,
                    checkUpPrice: checkUpPrice,
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function(data) {
                console.log("zeng_success", data);
                var table = $('#billtable').DataTable();
                table.row.add(data).draw();


            });

    });


});
$("#billtable>tbody").on('click', '.deal', function(event) {
    var that = this;
    $("#deal_submit").unbind('click').click(function(event) {
        var openPrice = $("input[name='openPrice']").val();
        var checkLowPrice = $("input[name='checkLowPrice']").val();
        var checkUpPrice = $("input[name='checkUpPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'deal',
                    openPrice: openPrice,
                    checkLowPrice: checkLowPrice,
                    checkUpPrice: checkUpPrice,
                    id: billId
                },
            })
            .done(function(data) {
                console.log("deal success", data);


                var table = $('#billtable').DataTable();
                table.row($(that).parents('tr')).remove().draw(false);
                table.row.add(data).draw();

            });

    });

});


$("#cancel").click(function(event) {
    $("#pingcang").css('display', 'none');
});
$("#cancel_add").click(function(event) {
    $("#zengcang").css('display', 'none');
});
$("#cancel_sub").click(function(event) {
    $("#jiancang").css('display', 'none');
});
$("#cancel_deal").click(function(event) {
    $("#deal").css('display', 'none');
});
$("#schat").click(function(event) {
    $(this).text('所有人');
    chat = null;
});
var HiChat = function() {
    this.socket = null;
};
HiChat.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        this.socket.on('who', function() {
            console.log("success");
            that.socket.emit('who', __info);

        });
        // this.socket.on('refresh', function() {
        //     window.location.reload();
        // })
        this.socket.on('login', function(user) {
            console.log(user);
            __users.push(user);
            $("#userdd").append("<li class='list-group-item'><a onclick='chatTo(" + user.id + "," + '"' + user.display + '"' + ")' ><img src='img/admin.png'>" + user.display + "</a></li>");
            $("#status").text(__users.length);

        });
        this.socket.on('room', function(alluser) {
            $("#userdd").find('li').remove();
            __users = alluser;
            console.log(__users);
            for (var i = 0; i < __users.length; i++) {
                $("#userdd").append("<li class='list-group-item'><a onclick='chatTo(" + __users[i].id + "," + '"' + __users[i].display + '"' + ")'  ><img src='img/admin.png'>" + __users[i].display + "</a></li>");

            };

        });
        this.socket.on('connect', function() {
            __users = [];
        });
        this.socket.on('disconnect', function() {
            __users = [];
        });
        this.socket.on('logout', function(idx) {
            __users.splice(idx, 1);

            $("#userdd").find('li').eq(idx).remove();
            $("#status").text(__users.length);

        });
        // this.socket.on('newMsg', function(user, msg, color) {
        //     that._displayNewMsg(user, msg, color);
        // });
        // this.socket.on('newImg', function(user, img, color) {
        //     that._displayImage(user, img, color);
        // });
        $("#bill").click(function(event) {
            var category = $("input[name='pro']:checked").val();
            var product = $("input[name='billtype']:checked").val();
            var type = $("input[name='kaicang']:checked").val();

            var openPrice = $("#openPrice").val().trim() || '';
            var checkUpPrice = $("#checkUpPrice").val().trim() || '';
            var checkLowPrice = $("#checkLowPrice").val().trim() || '';
            var createTIme = new Date();
            var lobby = $("input[name='send']:checked").length === 2;
            var bill = {
                //id:
                from: __info.id,
                category: category,
                product: product,
                lobby: lobby, //附送大厅,
                // moreless: /more/.test(type), //现价买多
                // hang:/hang/.test(type),
                type: type,
                openPrice: openPrice,
                checkUpPrice: checkUpPrice,
                checkLowPrice: checkLowPrice,
                operation: 'open', //open,
                createTime: new Date()
            }
            console.log(bill);
            $.ajax({
                    url: '/api/bill',
                    type: 'POST',
                    dataType: 'json',
                    data: bill,
                })
                .done(function(data) {
                    console.log("bill success", data);
                    $("#billtable").DataTable().row.add(
                        // "data":data.id,
                        // "data":data.product,
                        // "data":data.from,
                        // "data":data.type,
                        // "data":data.openPrice,
                        // "data":data.createTime,
                        // "data":data.checkUpPrice,
                        // "data":data,checkLowPrice,
                        // "data":"<a>平仓</a>",
                        // "data":data.state,
                        // "data":"<button class='btn btn-info btn-sm'>增仓</button><button class='btn btn-info btn-sm'>减仓</button>"

                        data).draw();
                    // alert("喊单成功！");

                });


            // that.socket.emit('bill', bill);
        });
        this.socket.on('bill', function(data) {
            console.log("bill success", data);

            if (data.succ == 0) {
                if (data.msg) {
                    console.log(data.msg);
                    $("#home").append("<p>" + data.msg + "</p>");

                } else {
                    console.log("receive");
                    var date = (new Date(data.createTime)).toLocaleTimeString();
                    var from = data.from;
                    var product = data.product;
                    // var moreless = data.moreless ? '做多' : '做空';
                    // var hang = data.hang ? '挂单' : '现金';
                    var type = data.type;
                    var operation = data.state;

                    // var lobby = data.lobby;
                    $("#home").append("<p>【喊单了！！！】" + date + "【" + from + "】发布：建议" + product + type + "</p>");
                    $("audio").attr('src', 'img/handan.mp3');
                    $("marquee").text("【喊单了！！！】" + date + "【" + from + "】发布：建议" + product + type);

                }
            } else {
                alert(data.msg);
            }
        });
        this.socket.on('speaker', function(data) {
            console.log("speaker", data)
            var speak = data.display;
            var msg = data.msg;
            var time = new Date(data.createTime).toLocaleTimeString();
            $("#home").append("<p>【行情提醒】" + time + "【" + speak + "】：" + msg + "</p>");
            $("audio").attr('src', 'img/ding.mp3');
            $("marquee").text("【行情提醒】" + time + "【" + speak + "】：" + msg);

        });

        document.getElementById('sendBtn').addEventListener('click', function() {
            var msg = $("#messageInput").val()
                // var messageInput = document.getElementById('messageInput'),
                //     msg = messageInput.value,
                // color = document.getElementById('colorStyle').value;
            $("#messageInput").val('');
            $("#messageInput").focus();
            if (msg.trim().length != 0) {
                if (chat != null) {
                    var message = {
                        from: __info.id,
                        to: chat,
                        createTime: new Date(),
                        context: msg,
                        whisper: false
                    }
                    console.log(message);
                    // that.socket.emit('msg', message);
                } else {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg,
                        whisper: false
                    };
                }
                that.socket.emit('msg', message);


                // that._displayNewMsg('我', msg, color);
                return;
            };
        }, false);
        if (document.getElementById('ding')) {
            document.getElementById('ding').addEventListener('click', function() {
                console.log('click!')
                var msg = $("#messageInput").val();
                $("#messageInput").val('');
                if (msg.trim().length != 0) {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg
                    };
                    console.log(message);

                    that.socket.emit('speaker', message);
                    // that._displayNewMsg('我', msg, color);
                };

            }, false);

        };

        this.socket.on('msg', function(msg) {
            console.log(msg);
            var from = __users[msg.from_idx].display;
            // var to = __users[msg.to_idx].display||'大家';
            var to = '大家';
            if (msg.to_idx >= 0) to = __users[msg.to_idx].display;

            var date = new Date().toTimeString().substr(0, 8);
            if (msg.to == __info.id) {
                $("#historyMsg1").append("<p><span class='timespan'>(" + date.substr(0, 19) + "): </span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover' data-placement='bottom'>" + from + '</a> 对【我】： ' + msg.context + "</p>");

            } else {
                $("#historyMsg").append("<p><span class='timespan'>(" + date.substr(0, 19) + "): </span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='bottom'>" + from + '</a> 对 ' + to + ' ：' + msg.context + "</p>");
                $(function() {
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a>屏蔽消息</a></li><li><a>禁言</a></li>"
                    })
                })
            }
            document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;
            document.getElementById('historyMsg1').scrollTop = document.getElementById('historyMsg1').scrollHeight;

        });
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            msg = $("#messageInput").val()
                // var messageInput = document.getElementById('messageInput'),
                //     msg = messageInput.value,
                // color = document.getElementById('colorStyle').value;
            $("#messageInput").focus();
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                if (chat != null) {
                    var message = {
                        from: __info.id,
                        to: chat,
                        createTime: new Date(),
                        context: msg,
                        whisper: false
                    }
                } else {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg,
                        whisper: false
                    };

                }

                that.socket.emit('msg', message);
                // that._displayNewMsg('我', msg, color);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('historyMsg').innerHTML = '';
            document.getElementById('historyMsg1').innerHTML = '';
        }, false);
        // document.getElementById('sendImage').addEventListener('change', function() {
        //     if (this.files.length != 0) {
        //         var file = this.files[0],
        //             reader = new FileReader(),
        //             color = document.getElementById('colorStyle').value;
        //         if (!reader) {
        //             that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
        //             this.value = '';
        //             return;
        //         };
        //         reader.onload = function(e) {
        //             this.value = '';
        //             that.socket.emit('img', e.target.result, color);
        //             that._displayImage('我', e.target.result, color);
        //         };
        //         reader.readAsDataURL(file);
        //     };
        // }, false);
        // this._initialEmoji();
        // document.getElementById('emoji').addEventListener('click', function(e) {
        //     var emojiwrapper = document.getElementById('emojiWrapper');
        //     emojiwrapper.style.display = 'block';
        //     e.stopPropagation();
        // }, false);
        // document.body.addEventListener('click', function(e) {
        //     var emojiwrapper = document.getElementById('emojiWrapper');
        //     if (e.target != emojiwrapper) {
        //         emojiwrapper.style.display = 'none';
        //     };
        // });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },
    // _initialEmoji: function() {
    //     var emojiContainer = document.getElementById('emojiWrapper'),
    //         docFragment = document.createDocumentFragment();
    //     for (var i = 69; i > 0; i--) {
    //         var emojiItem = document.createElement('img');
    //         emojiItem.src = '../content/emoji/' + i + '.gif';
    //         emojiItem.title = i;
    //         docFragment.appendChild(emojiItem);
    //     };
    //     emojiContainer.appendChild(docFragment);
    // },
    // _displayNewMsg: function(user, msg, color) {
    //     var container = document.getElementById('historyMsg'),
    //         msgToDisplay = document.createElement('p'),
    //         date = new Date().toTimeString().substr(0, 8),
    //         //determine whether the msg contains emoji
    //         msg = this._showEmoji(msg);
    //     msgToDisplay.style.color = color || '#000';
    //     msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
    //     container.appendChild(msgToDisplay);
    //     container.scrollTop = container.scrollHeight;
    // },
    // _displayImage: function(user, imgData, color) {
    //     var container = document.getElementById('historyMsg'),
    //         msgToDisplay = document.createElement('p'),
    //         date = new Date().toTimeString().substr(0, 8);
    //     msgToDisplay.style.color = color || '#000';
    //     msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
    //     container.appendChild(msgToDisplay);
    //     container.scrollTop = container.scrollHeight;
    // },
    // _showEmoji: function(msg) {
    //     var match, result = msg,
    //         reg = /\[emoji:\d+\]/g,
    //         emojiIndex,
    //         totalEmojiNum = document.getElementById('emojiWrapper').children.length;
    //     while (match = reg.exec(msg)) {
    //         emojiIndex = match[0].slice(7, -1);
    //         if (emojiIndex > totalEmojiNum) {
    //             result = result.replace(match[0], '[X]');
    //         } else {
    //             result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />'); //todo:fix this in chrome it will cause a new request for the image
    //         };
    //     };
    //     return result;
    // }
};

function postOptionClickHandler(ele,modal){
    ele.click(function(event){
        modal.selectedEle = $(this);
        modal.css('left',event.pageX-modal.width());
        modal.css('top',event.pageY);
        modal.show();
        return false;
    });
}

function postOptionModalInit(modal){
    modal.find("div[action='delete']").click(function(){
        var postrow = modal.selectedEle.parents('.post-row');
        var postId = postrow.attr('uid');
        $.post('/posts/delete?id='+postId,function(){
            postrow.remove();
            modal.hide();
            modal.mouseIn = false;
        });
    });
    modal.mouseenter(function(){
        modal.mouseIn = true;
    });
    modal.mouseleave(function(){
        modal.mouseIn = false;
    });
    $(document.body).click(function(){
        if(modal.is(":visible") && !modal.mouseIn){
            modal.hide();
        }
    });
}
function photoInitHeightHandler(ele){
    for(var i=0;i<ele.length;i++){
        var img = $(ele[i]).find(':first-child');
        img.load(function(){
            $(this).parent().height($(this).height());
        });
    }
}

function rightPanelHoverHandler(ele){
    ele.hover(function(){
        var viewall = $(this).find('.listpanel-header-viewall');
        viewall.fadeTo(100,1);
    },function(){
        var viewall = $(this).find('.listpanel-header-viewall');
        viewall.fadeTo(100,0);
    });
}

function rightPanelRowHoverHandler(ele){
    ele.hover(function(){
        $(this).find('.rightpanel-delbtn').fadeTo(100,1);
    },function(){
        $(this).find('.rightpanel-delbtn').fadeTo(100,0);
    });
}

function likeBtnClickHandler(ele){
    ele.click(function(){
        var post = $(this).parents('.post-row');
        var likenum = $(this).parent().next().find('.likenum');
        $.post('/posts/like?id='+post.attr('uid'),function(data){
            likenum.text(data);
            var likeAvatar = post.find('.like-avatar');
            if(likeAvatar.is(":hidden"))
                likeAvatar.show();
            else
                likeAvatar.hide();
            if(data > 0){
                post.find('.post-likenum').show();
            }else{
                post.find('.post-likenum').hide();
            }
        });
    });
}

function postHoverHandler(ele){
    ele.hover(function(){
        var author = $(this).find('.post-header-author');
        author.css('color','#2f63cf');
        $(this).find('.post-actions-btn').addClass('post-actions-btnHover');
    },function(){
        var author = $(this).find('.post-header-author');
        author.css('color','#000');
        $(this).find('.post-actions-btn').removeClass('post-actions-btnHover');
    });
}

function postDelBtnClickHandler(ele){
    ele.click(function(){
        var post = $(this).parents('.post').parent().parent();
        $.post('/posts/delete?id='+post.attr('uid'),function(){
            post.remove();
        });
    });
}

function postExpandBtnClickHandler(ele){
    ele.find('.post-message-expand').click(function(){
        $(this).parent().hide();
        $(this).parent().next().show();
    });
    ele.next().find('.post-message-collapse').click(function(){
        $(this).parent().hide();
        $(this).parent().prev().show();
    });
}

function commentsMoreClickHandler(ele){
    ele.click(function(){
        $(this).hide();
        $(this).next().show();
        var comments = $(this).parents('.comments');
        var id = comments.parents('.post-row').attr('uid');
        $.post('/comments/list?source_id='+id+'&show=all',function(data){
            comments.find('.comments-list').html(data);
            commentHoverHandler(comments.find('.comment'));
            commentDelBtnClickHandler(comments.find('.comment-delbtn'));
            commentReplyClickHandler(comments.find('.comment-reply'));
            avatarHoverHandler(comments.find('.avatar-icon'));
        });
    });
    ele.next().click(function(){
        $(this).hide();
        $(this).prev().show();
        var comments = $(this).parents('.comments');
        var id = comments.parents('.post-row').attr('uid');
        $.post('/comments/list?source_id='+id+'&show=1',function(data){
            comments.find('.comments-list').html(data);
            commentHoverHandler(comments.find('.comment'));
            commentDelBtnClickHandler(comments.find('.comment-delbtn'));
            commentReplyClickHandler(comments.find('.comment-reply'));
            avatarHoverHandler(comments.find('.avatar-icon'));
        });
    });
}

function commentNoInputClickHandler(ele){
    ele.click(function(){
        $(this).hide();
        var comment_input = $(this).parents('.comments').find('.comments-newinput-section');
        comment_input.show();
        comment_input.find('.comments-newinput-text').focus();
    });
}

function commentNewInputKeydownHandler(ele){
    ele.on('keydown paste',function(){
        var addbtn = $(this).parents('.comments-newinput-section').find('.comment-addbtn');
        setTimeout(function() {
            if(ele.text().length > 0){
                addbtn.removeClass('disabled');
            }else{
                addbtn.addClass('disabled');
            }
        },100);
    });
}

function commentAddBtnClickHandler(ele){
    ele.click(function(){
        var sendbtn = $(this);
        if(sendbtn.hasClass('disabled'))
            return false;
        var comments = sendbtn.parents('.comments');
        var comments_list = comments.find('.comments-list');
        var source_id = $(this).attr('source_id');
        var content = $(this).parents('.comments-newinput-section').find('.comments-newinput-text');
        var params = {};
        params["source_id"] = source_id;
        params["source_type"] = 'POST';
        params["content"] = content.html();
        $.post('/comments/create',params,function(data){
            content.text('');
            sendbtn.next().trigger('click');
            comments_list.append(data);
            var comment_num = comments.find('.comments-num');
            comment_num.text(parseInt(comment_num.text())+1);
            if(parseInt(comment_num.text()) > 3 && comments_list.prev().is(":hidden")){
                comments_list.prev().show();
                comments_list.find('.comment:first').remove();
            }
            var newComment = comments_list.find('.comment:last');
            commentHoverHandler(newComment);
            commentDelBtnClickHandler(newComment.find('.comment-delbtn'));
            commentReplyClickHandler(newComment.find('.comment-reply'));
            avatarHoverHandler(newComment.find('.avatar-icon'));
        });
    });
}

function commentCancelBtnClickHandler(ele){
    ele.click(function(){
        var comment_input = $(this).parents('.comments-newinput-section');
        comment_input.find('.comments-new-content').empty();
        comment_input.hide();
        var comment_input_fake = comment_input.parents('.comments');
        comment_input_fake.find('.comments-noinput-text').show();
    });
}

function commentHoverHandler(ele){
    ele.hover(function(){
        var delbtn = $(this).find('.comment-delbtn');
        delbtn.show();
        var reply = $(this).find('.comment-reply');
        reply.show();
    },function(){
        var delbtn = $(this).find('.comment-delbtn');
        delbtn.hide();
        var reply = $(this).find('.comment-reply');
        reply.hide();
    });
}

function commentDelBtnClickHandler(ele){
    ele.click(function(){
        var comment = $(this).parents('.comment');
        var comments = comment.parents('.comments');
        var nums = comments.find('.comments-num');
        $.post('/comments/delete?id='+comment.attr('uid'),function(){
            nums.text(parseInt(nums.text())-1);
            if(parseInt(nums.text()) == 3)
                comments.find('.comments-more').trigger('click');
            if(parseInt(nums.text()) < 4){
                comments.find('.comments-more').hide();
                comments.find('.comments-hidemore').hide();
            }
            comment.remove();
        });
    });
}

function commentReplyClickHandler(ele){
    ele.click(function(){
        var comment = $(this).parents('.comment');
        var author = comment.find('.comment-author').text();
        var comments = comment.parents('.comments');
        comments.find('.comments-noinput-text').trigger('click');
        comments.find('.comments-new-content').text('+'+author);
    });
}

function avatarHoverHandler(ele){
    var inHandler = null;
    var outHandler = null;
    ele.hover(
        function(evt){
            clearTimeout(outHandler);
            var personId = $(this).attr('uid');
            inHandler = setTimeout(function(){
                if(evt.pageX+210 > $(document).width())
                    $('#avatarModal').css('left',$(document).width()-280);
                else
                    $('#avatarModal').css('left',evt.pageX+10);
                $('#avatarModal').css('top',evt.pageY);
                $.post('/people/avatar?id='+personId,function(avatarData){
                    $('#avatarModal').html(avatarData);
                    $('#avatarModal').show();
                });
            },1000);
        },function(evt){
            clearTimeout(inHandler);
            outHandler = setTimeout(function(){
                var mouseX = evt.pageX;
                var mouseY = evt.pageY;
                if(mouseX < $('#avatarModal').offset().left
                    || mouseX > $('#avatarModal').offset().left+$('#avatarModal').width()
                    || mouseY < $('#avatarModal').offset().top
                    || mouseY > $('#avatarModal').offset().top+$('#avatarModal').height()){
                    $('#avatarModal').hide();
                }
            },1000);
        }
    );
}
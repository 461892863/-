<template>
  <div id="messageCenter">
    <div class="messageBox">
      <div class="messageLists" v-infinite-scroll="lists" infinite-scroll-disabled="loading"
           infinite-scroll-distance="1">
        <div class="listsBox" v-for="item in messageList">
          <div class="lists">
            <div class="listsInfor">
              <img v-if="item.faceimg!=''&&item.faceimg!=null"  :src="url1+item.faceimg" alt="">
              <img v-if="item.faceimg == '' || item.faceimg == null" src="./images/admin.png" alt="">
              <div class="informationsAll">
                <p>{{item.username}}</p>
                <p class="depet">
                  <span>{{item.dept}}</span>
                  <span>|</span>
                  <span>{{item.age}}</span>
                </p>
              </div>
            </div>
            <div class="artic">
              {{decodeURI(item.messageContent)}}
              <img src="./images/zanlewo.png" alt="" v-if="item.status==2">
            </div>
            <div class="time">
              <div>{{item.addDate}}</div>
              <img src="./images/huifu.png" alt="" @click="sendComent(item.sendid)">
            </div>
          </div>
          <!--<div class="listsDetail">-->
          <!--<div class="commentLists">-->
          <!--<div class="plContent">-->
          <!--<span class="name">小明</span>:-->
          <!--<span>哈哈哈哈</span>-->
          <!--</div>-->
          <!--<p class="time">2018-05-15 16:55</p>-->
          <!--</div>-->
          <!--</div>-->
        </div>
      </div>
      <!--暂无数据-->
      <!--<div style="text-align: center;margin-top: 0.5rem;" class="no_msg" v-show="dataLists">
        <img style="width:80%;" src="./images/nodata.png" alt="">
        <p>暂无消息</p>
      </div>-->

      <!--加载中-->
      <div v-show="loadingShow"
           style="overflow:hidden;padding:0.5rem 0;margin:0 auto;color:#aaa;width:4.5rem;font-size:0.75rem;text-align:center;">
        <mt-spinner style="float:left;" :type="3" color="#aaa" :size="20"></mt-spinner>
        <span style="font-size: 12px;">加载中</span>
      </div>

      <!--暂无数据-->
      <div style="text-align: center;margin-top: 0.5rem;" class="no_msg" v-if="noData">
        <!--<img style="width:80%;" src="./images/nodata.png" alt="">-->
        <p style="font-size: 12px;padding: .5rem;color: #aaa;text-align: center;clear: both">------暂无数据------</p>
      </div>
      <!--没有更多数据-->
      <div style="text-align: center;margin-top: 0.5rem;" class="noData" v-if="noMoreData">
        <!--<img style="width:80%;" src="./images/nodata.png" alt="">-->
        <p style="font-size: 12px;padding: .5rem;color: #aaa;text-align: center;clear: both">------已显示所有内容------</p>
      </div>
    </div>
    <!--评论弹框-->
    <div id="letterModel" v-show="showMsg" @click="hideMsg"></div>
    <div id="msg_letter" v-show="showMsg">
      <textarea placeholder="请输入私信内容" v-model="msgLetter"></textarea>
      <div @click="sendLetter" class="buttons">回复</div>
    </div>
  </div>


</template>

<script>
  export default {
    data() {
      return {
        messageList: [],
        dataLists: false,
        showMsg: false,
        msgLetter: '',
        url1: '',
        receiveUserid: '',  //发送人
        loading: true,
        pageIndex: 0,
        pageSize: 10,
        noData: false,
        noMoreData: false,
        loadingShow: false,
      }
    },
    created: function () {
      $("#title").text("我的消息");
      this.$MintUI.Indicator.close();
      this.userid = this.WX_UserId;
      this.url1 = this.url;
      clearTimeout(this.setTime);
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
      // this.$MintUI.Indicator.open('加载中');
    },
    mounted: function () {
      this.lists();
    },
    methods: {
      sendComent: function (sendid) {
        var that = this;
        that.showMsg = true;
        that.receiveUserid = sendid;
      },
      hideMsg: function () {
        this.showMsg = false;
      },
      //获取消息列表
      lists: function () {
        var that = this;
        that.loading = true;
        if (that.pageIndex > 0) {
          that.loadingShow = true;
        }
        this.setTime = setTimeout(function () {
          that.$MintUI.Indicator.open("加载中");
        }, that.timeNum);
        $.ajax({
          type: "post",
          url: that.port + "/api/QueQiao/MyMessage",
          data: {
            userid: that.userid,
            type: '0',
            PageIndex: that.pageIndex,
            PageSize: that.pageSize,
          },
          dataType: "json",
          success: function (res) {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              for (var i = 0; i < data.length; i++) {
                that.messageList.push(data[i]);
              }
              if (data.length < that.pageSize) {
                that.loading = true;
                if (that.pageIndex == 0 && that.messageList.length <= 0) {
                  that.noData = true
                } else {
                  that.noMoreData = true;
                }
              } else {
                that.noData = false;
                that.noMoreData = false;
                that.$nextTick(function () {
                  that.loading = false;
                  that.pageIndex++;
                })
              }
              console.log(data);
            }
          }, error: function () {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
          }
        });
      },
      //评论
      sendLetter: function () {
        this.showMsg = false;
        var that = this;
        if (that.msgLetter == "") {
          that.$MintUI.Toast("回复内容不能为空");
          return false;
        }
        var msgLetter = encodeURI(that.msgLetter);
        $.ajax({
          type: 'post',
          url: that.port + "/api/QueQiao/SendMessage",
          data: {
            sendId: this.userid,
            receiveId: that.receiveUserid,
            title: "",
            content: msgLetter
          },
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              that.$MintUI.Toast(res.msg);
              that.msgLetter = "";
              that.showMsg = false;
            } else {
              that.$MintUI.Toast("回复失败");
            }
          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
          }
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/messageCenter.css";

  #messageCenter {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  /*# sourceMappingURL=home.css.map */
</style>

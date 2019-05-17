<template>
  <div class="msgActivity">
    <div style="position: fixed;width: 100%;height: 40px;background: red;bottom: 0;left: 0;">这是下面的</div>
    <!--搜索-->
    <div id="search">
      <input type="text" placeholder="请输入姓名" v-model="name"><img @click="btnSearch" src="./images/jy-15.png" alt="">
    </div>
    <div id="choose">
      <div>
        共{{totalMsg}}条信息
      </div>
      <div @click="show= !show">
        <span>默认排序</span>
        <img style="width:.6rem;margin-left: .2rem;" src="./images/jy-16.png" alt="">
      </div>
    </div>
    <!--列表-->
    <div id="toScroll" style="width: 100%;height: 100%;overflow: auto;-webkit-overflow-scrolling: touch;position: relative;
" v-infinite-scroll="load" infinite-scroll-disabled="loading"
         infinite-scroll-distance="1">
      <div id="List">
        <div class="list" v-for="item in list" @click="detail(item.userid)">
          <div class="headImg">
            <div v-if="item.isfollow == 1&&item.userid!=userid" class="isfollow">
              <img src="./images/jy-21+.png">
            </div>
            <!--<img v-if="item.img!=null" :src="item.img" alt="">-->
            <img v-changeSize v-if="item.img!=null" :src="item.img" alt="">
            <img v-else src="./images/normal.png" style="width: 100%;height: 100%;">
          </div>
          <div class="personalInfo">
            <div class="personalInfoLeft">
              <span>{{item.name}}</span>
              <img v-if="item.gender==1" src="./images/jy-5.png">
              <img v-if="item.gender==2" src="./images/jy-4.png">
            </div>
            <div class="personalInfoRight">
              {{item.age}}岁/{{item.departName}}
              <!--<span class="marry" v-if="item.status==0">单身</span><span class="marry" v-if="item.status==1"></span>-->
            </div>
            <!-- <p class="declaration" v-if="item.remark!=null"><span><img src="./images/declaration.png" alt=""><span>{{item.remark}}</span></span>
             </p>-->
            <!--动态-->
            <!--<p class="dt" v-if="item.dongtai!=''">动态：{{item.dongtai}}</p>-->
          </div>
          <div class="description" v-html="item.remark !=null && item.remark !=''?decodeURI(item.remark):'TA什么都没留下...'">
            {{decodeURI(item.remark)}}
          </div>
        </div>
        <!--加载中-->
        <div class="toLoadingShow" v-show="loadingShow"
             style="overflow:hidden;margin:0 auto;color:#aaa;display: flex;align-items: center;justify-content: center;">
          <mt-spinner style="display: inline-block;" :type="3" color="#aaa" :size="20"></mt-spinner>
          <span style="font-size: 12px;">加载中</span>
        </div>
        <p class="toLoadingShow" v-show="noMoreData"
           style="margin-top: .5rem;color: #aaa;text-align: center;clear: both;font-size: 12px;">
          ------已显示所有内容------
        </p>
        <p class="toLoadingShow" v-show="noData"
           style="padding-top: .5rem;color: #aaa;text-align: center;clear: both;font-size: 12px;">
          ------暂无数据------</p>
        <!-- <div id="more" @click="more" v-show="list.length>=10 && ishow">
           点击加载更多
         </div>-->
        <!--没有更多数据-->
        <!-- <div id="more" style="text-align: center;margin-top: 0.5rem;" v-show="list.length>=10 && !ishow">
           <p>没有更多数据~</p>
         </div>-->
        <!--<p style="color: #aaa;text-align: center;padding: .5rem">&#45;&#45;&#45;&#45;&#45;&#45;已显示所有内容&#45;&#45;&#45;&#45;&#45;&#45;</p>-->
        <!--暂无数据-->
        <!--<div style="text-align: center;margin-top: 0.5rem;" class="no_msg" v-show="list.length==0">
          <img style="width:80%;" src="./images/nodata.png" alt="">
          <p>暂无数据</p>
        </div>-->
      </div>
    </div>
    <!--<router-link to="/love/lPlain" id="plain">
      <img src="./images/plain.png" alt="">
      <span style="display: block;">功能说明</span>
    </router-link>-->
    <!--底部-->
    <div id="footer">
      <ul>
        <router-link to="/love/makeFriend" class="red" style="text-align: center;">
          <li>
            <img src="./images/jy-8.png" alt="">
            <span>缘分</span>
          </li>
        </router-link>
        <router-link to="/love/dynamics" style="text-align: center;">
          <li>
            <img src="./images/jy-9.png" alt="">
            <span>说说</span>
          </li>
        </router-link>
        <router-link to="/love/lPerCenter" style="text-align: center;">
          <li>
            <img style="margin-right: 0.1rem;" src="./images/jy-11.png" alt="">
            <span>我的</span>
          </li>
        </router-link>
      </ul>
    </div>
    <!--排序弹框-->
    <div id="model" v-show="show" @click="model"></div>
    <div id="sort" v-show="show">
      <ul>
        <li @click="setSort(0)" :class="{'red':sort==0}" id="0"><span>默认排序</span><span class="yes"
                                                                                       v-show="sort==0">√</span>
        </li>
        <li :class="{'red':sort==1}" id="1">
          <span>性别排序</span>
          <label style="margin-left:2.3rem;color:#333;">
            <input @change="radio(1)" type="radio" class="sex" name="sex">男
          </label>
          <label style="margin-left:1.79rem;color:#333;">
            <input @change="radio(2)" type="radio" class="sex" name="sex">女
          </label>
          <span class="yes" v-show="sort==1">√</span>
        </li>
        <li :class="{'red':sort==2}" id="2">
          <span>按部门查询</span>
          <input style="width:7rem;height:1.5rem;border: none;outline: none;margin-left: 1.5rem;"
                 @click="getJsApiConfig" v-model="showDept" readonly="" unselectable="on" onfocus="this.blur()"
                 type="text"
                 placeholder="点击选择部门">
          <!-- <select v-model="dept" id="department" @change="sortDept">
          <option value="">全部</option>
          <option v-for="item in deptSort" :value="item.name">{{item.name}}</option>
      </select> -->
          <span class="yes" v-show="sort==2">√</span>
        </li>
        <!-- <li :class="{'red':sort==3}" id="3">
        <span>按婚姻状态</span>
        <label style="margin-left:1.5rem;color:#333;">
            <input @change="marryS(1)" type="radio" class="marry" name="marry">未婚
        </label>
        <label style="margin-left:1rem;color:#333;">
            <input @change="marryS(0)" type="radio" class="marry" name="marry">已婚
        </label>
        <span class="yes" v-show="sort==3">√</span>
    </li> -->
        <li :class="{'red':sort==4}" id="4">
          <span>按年龄查询</span>
          <select name="" id="age" v-model="age" @change="sortAge">
            <option value="0">全部</option>
            <option value="18-22">18-22</option>
            <option value="23-25">23-25</option>
            <option value="26-29">26-29</option>
            <option value="30-35">30-35</option>
            <option value="36-40">36-40</option>
            <option value="40-70">40岁以上</option>
          </select>
          <span class="yes" v-show="sort==4">√</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'msgActivity',
    data() {
      return {
        show: false,
        sort: '0',
        sex: '',
        status: '0',
        list: [],
        pageIndex: 0,         //分页椰树
        pageSize: 10,         //每页几条数据
        sortName: 0,
        age: '0',  //年龄
        ageMin: '0',  //最小年龄
        ageMax: '0',  //最大年龄
        sortSex: '0',  //性别
        dept: '',  //部门
        name: '',   //姓名
        deptSort: [],  //部门数据
        ishow: true,
        loadingShow: false,
        loading: true,
        totalMsg: 0, //所有信息数
        noData: false,
        noMoreData: false,
        showDept: '',
        oParent: '',//瀑布流父级
        aChild: '', //子集
        aHeight: [], //声明一个空数组来存储每一列的高度
        oneWidth: ''
      }
    },
    created: function () {
      $("#title").text("茅台佳缘");
      this.$MintUI.Indicator.close();
      this.userid = this.WX_UserId;
      this.url1 = this.port;
      clearTimeout(this.setTime);
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
      // this.$MintUI.Indicator.open('加载中');
    },
    mounted: function () {
      this.load();
      //this.department();
      this.getSignature();
      // document.getElementById('List').addEventListener('scroll', this.toScroll)
    },
    //指令
    directives: {
      //图片自动适应
      changeSize: {
        inserted: function (el) {
          let getImgInfo = function (url) {
            return new Promise(resovle => {
              let img = new Image();
              let json = {};
              img.src = url;
              img.onload = function () {
                json['width'] = img.width;
                json['height'] = img.height;
                resovle(json);
              }
            })
          };
          let maxwidth = el.parentNode.offsetWidth;
          getImgInfo(el.src).then(res => {
            var that = this;
            var theWidth = el.width;
            var theHeight = el.height;
            if (theWidth > theHeight) {
              el.style.height = '100%';
              el.style.width = 'auto';
            } else {
              el.style.height = 'auto';
              el.style.width = '100%';
            }
          })
        },
      }
    },
    methods: {
      //瀑布流
      waterFall: function (parent, children) {
        var oParent = document.getElementById(parent);
        var aChild = oParent.getElementsByClassName(children);
        var oneWidth = aChild[0].offsetWidth;
        // this.cols = Math.floor((document.documentElement.clientWidth || document.body.clientWidth) / this.oneWidth);  // 网页宽度/一个元素宽度=列数，Math.floor()表示向下取整。
        var cols = 2;
        var aHeight = []; //声明一个空数组来存储每一列的高度
        for (var i = 0; i < aChild.length; i++) {
          if (i < cols) { //i < cols表示是第一行的元素
            aChild[i].style.top = 0; // 第一行top为0
            aChild[i].style.left = i * oneWidth + 'px'; // 第一行left=下标*一个元素的宽度
            aHeight[i] = aChild[i].offsetHeight; // 把第一行每个的高度存进aHeight数组中
          } else {
            var minHeight = Math.min.apply(null, aHeight), // 使用Math.min.apply()得到数组中的最小数，即第一行高度最矮的
              minIdx = aHeight.indexOf(minHeight); // 获取对应的下标
            aChild[i].style.top = minHeight + 'px'; // 定位，top为上一行最小的高度值
            aChild[i].style.left = minIdx * oneWidth + 'px'; // left为对应下标*一个元素宽度
            aHeight[minIdx] += aChild[i].offsetHeight; //更新数组，总是最小高度的一列加上后面的元素的高度。
          }
        }
        var maxHeight = Math.max.apply(null, aHeight);
        // $('.list:last')

        oParent.style.height = maxHeight + 'px'; //因为是绝对定位absolute，所以父级没有高度，需要取最高的一列的高度给父级

        // $('.toLoadingShow').css('bottom', -40)


        // oParent.style.width = cols * oneWidth + 'px'; //设置父级宽度
        /* setTimeout(function () {
           if(this.pageIndex <= 1){
             $('.toLoadingShow').css('top', 0);
           }else{
             var toLoadingShowH = 30;
             var theLast =document.getElementById('List').offsetHeight;
             $('.toLoadingShow').css('bottom', '-40px');
           }

         }, 500)*/
      },

      //获取签名等信息,
      getSignature: function () {
        var that = this;
        var url = window.location.href;
        if (window.location.hash.length) {
          url = url.substr(0, url.indexOf(window.location.hash));
        }
        $.ajax({
          type: "post",
          url: that.port + "api/Service/GetJsApiConfig",
          data: {url: url},
          dataType: "json",
          success: function (res) {
            var result = JSON.parse(res.data);
            wx.config({
              beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: that.Crop_Id + '', // 必填，企业微信的cropID
              timestamp: result.timestamp, // 必填，生成签名的时间戳
              nonceStr: result.nonceStr + '', // 必填，生成签名的随机串
              signature: result.signature + '',// 必填，签名，见附录1
              jsApiList: ['selectEnterpriseContact'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          }, error: function () {
            that.wxError();
          }
        });
      },
      getJsApiConfig: function () {
        var that = this;
        wx.ready(function () {
          that.modelShow();
        });

      },
      modelShow: function () {  //,
        var that = this;
        wx.invoke("selectEnterpriseContact", {
            "fromDepartmentId": 0, // 必填，-1表示打开的通讯录从自己所在部门开始展示, 0表示从最上层开始
            "mode": "single", // 必填，选择模式，single表示单选，multi表示多选
            "type": ["department"]  // 必填，选择限制类型，指定department、user中的一个或者多个
          }, function (res) {
            that.dept = "";
            that.list = [];
            that.pageindex = 0;
            if (res.err_msg == "selectEnterpriseContact:ok") {
              if (typeof res.result == 'string') {
                res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
              }
              var selectedDepartmentList = res.result.departmentList;// 已选的部门列表
              if (selectedDepartmentList.length != 0) {
                for (var i = 0; i < selectedDepartmentList.length; i++) {
                  that.showDept = selectedDepartmentList[i].name;
                  that.dept = selectedDepartmentList[i].id;
                  // that.sort = 2;
                  // that.ageMin = "0";
                  // that.ageMax = "0";
                  // that.sortSex = "0";
                  // that.age = "0";
                  // that.status = "0";
                }
              }
            }
          }
        )
      },
      //点击加载更多
      load: function () {
        var that = this;
        that.loading = true;
        if (that.pageIndex > 0) {
          that.loadingShow = true;
        }
        /*this.setTime = setTimeout(function () {
          that.$MintUI.Indicator.open("加载中");
        }, that.timeNum)*/
        // that.pageindex = 0;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/GetQueQiaoList",
          data: {
            userid: that.userid,
            name: that.name,
            ageMin: that.ageMin,
            ageMax: that.ageMax,
            sortSex: that.sortSex,
            Dept: that.dept,
            status: that.status,
            pageIndex: that.pageIndex,
            pageSize: that.pageSize
          },
          dataType: "json",
          success: function (res) {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              that.$MintUI.Indicator.close();
              // that.list = [];
              var data = JSON.parse(res.data).queqiaolist;
              that.totalMsg = JSON.parse(res.data).count;
              for (var i = 0; i < data.length; i++) {
                if (data[i].img == null) {
                  // data[i].img = "./images/mrHeader.jpg";
                } else {
                  data[i].img = that.port + data[i].img;
                }
              }
              for (var i = 0; i < data.length; i++) {
                that.list.push(data[i])
              }
              console.log(that.list);
              that.$nextTick(function () {
                that.waterFall('List', 'list');
              });

              if (data.length < that.pageSize) {
                // $('.list:last .headImg').css('height','10rem');
                that.loading = true;
                if (that.pageIndex == 0 && that.list.length <= 0) {
                  that.noData = true
                } else {
                  that.noMoreData = true;
                }
                return false;
              } else {
                that.loadingShow = false;
                clearTimeout(that.setTime);
                that.noData = false;
                that.noMoreData = false;
                that.$nextTick(function () {
                  that.loading = false;
                  that.pageIndex++;
                })
              }
              that.$MintUI.Indicator.close();
            } else {
              that.$MintUI.Indicator.close();
              that.$MintUI.Toast(res.msg);
            }
          }, error: function () {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
          }
        });
      },
      btnSearch: function () {
        this.$MintUI.Indicator.open("搜索中");
        this.load();
      },
      Ishow: function () {    //排序弹框
        this.show = true;
      },
      setSort: function (e) {   //设置默认排序
        this.sort = e;
        var sex = document.querySelectorAll(".sex");
        for (var i = 0; i < sex.length; i++) {
          sex[i].checked = false;
        }
        this.sex = "";
        var marry = document.querySelectorAll(".marry");
        for (var i = 0; i < marry.length; i++) {
          marry[i].checked = false;
        }
        this.marry = "";
        this.dept = "";
        this.ageMin = "0";
        this.ageMax = "0";
        this.sortSex = "0";
        this.age = "0";
        this.status = "0";
      },
      radio: function (e) {  //设置性别
        // this.sort = 1;
        // this.sex = e;
        var marry = document.querySelectorAll(".marry");
        for (var i = 0; i < marry.length; i++) {
          marry[i].checked = false;
        }
        // this.dept = "";
        // this.ageMin = "0";
        // this.ageMax = "0";
        this.sortSex = e;
        // this.age = "0";
        // this.status = "0";
      },
      /* sortDept: function () {    //部门选择
         this.sort = 2;
         this.ageMin = "0";
         this.ageMax = "0";
         this.sortSex = "0";
         this.age = "0";
         this.status = "0";
       },*/
      /* marryS: function (e) {   //设置是否结婚了
         this.sort = 3;
         this.status = e;
         var sex = document.querySelectorAll(".sex");
         for (var i = 0; i < sex.length; i++) {
           sex[i].checked = false;
         }
         this.sex = "";
         this.dept = "";
         this.ageMin = "0";
         this.ageMax = "0";
         this.sortSex = "0";
         this.age = "0";
       },*/
      sortAge: function () {   //按年龄排序
        // this.sort = 4;
        var that = this;
        this.ageMin = that.age.split("-")[0];
        this.ageMax = that.age.split("-")[1];
        // this.sortSex = "0";
        // this.status = "0";
        // this.dept = "";
      },
      model: function () {
        var that = this;
        /* this.setTime = setTimeout(function () {
           debugger
           that.$MintUI.Indicator.open("排序中");
         },that.timeNum)*/
        that.show = false;
        /*if (that.sort == 0) {
          that.sortName = "默认排序"
        } else if (that.sort == 1) {
          that.sortName = "按性别"
        } else if (that.sort == 2) {
          that.sortName = "按部门"
        } else if (that.sort == 3) {
          that.sortName = "按婚姻状态"
        } else if (that.sort == 4) {
          that.sortName = "按年龄"
        }*/
        this.list = [];
        this.noMoreData = false;
        this.noData = false;
        this.pageIndex = 0;
        that.load();
      },
      detail: function (e) {  //跳转详情
        this.$router.push({
          path: '/love/detail',
          query: {
            id: e
          }
        })
      },
      department: function () {   //部门数据,
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/UserBaseInfo/GetDeptList",
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              that.deptSort = data;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
          }
        });
      }
    },
    watch: {
      name: function (value) {
        this.name = value;
        this.list = [];
        this.noMoreData = false;
        this.noData = false;
        this.pageIndex = 0;
        clearTimeout(this.setTime)
        // $('#List').height(50);
        // $('.toLoadingShow').css('bottom', 0)
        this.load();
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/msgActivity.css";

  #plain {
    width: 3rem;
    height: 3rem;
    position: fixed;
    bottom: 3.5rem;
    right: 0.5rem;
    background-color: #fff;
    border-radius: 50%;
    text-align: center;
    color: #666;
    font-size: 0.5rem;
    box-shadow: 0px 0px 16px 0px rgba(200, 200, 200, 0.75);
  }

  #plain img {
    width: 1rem;
    height: 0.75rem;
    margin-top: 0.7rem;
  }

  .toLoadingShow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 2rem;
    text-align: center;
    bottom: -40px;
    left: 0;
  }


  /*# sourceMappingURL=home.css.map */
</style>

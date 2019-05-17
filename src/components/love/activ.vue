<template>
    <div id="app" v-cloak>
        <!--背景图-->
	<div id="img">
            <img :src="url1+bigImg" alt="">
        </div>
        <!--活动信息-->
        <div id="activeMsg">
            <p>活动标题：{{title}}</p>
            <p>活动时间：<span>{{startTime}}-{{endTime}}</span></p>
            <p>活动地点：{{address}}</p>
            <p>活动类型：{{activityType}}</p>
            <p>发布方：管理员</p>
        </div>
        <!--活动介绍-->
        <div id="introduce">
            <p><img src="./images/introduce.png" alt=""><span>活动说明</span> <span class="peo">已报名{{perNum}}人</span> </p>
            <div>
                <p id="content">{{activeMsg}}</p>
            </div>
        </div>
        <!--提交-->
        <div id="submit" @click="submit">
            报名
        </div>
    </div>


</template>

<script>
    export default {
        data() {
            return {
                imgList:[],
			imgMore:[],
			mine:'',
			userid:'',
			id:'',  //活动id
			startTime:'',  //开始时间
			endTime:'', //结束时间
			address:'',  //活动地址
			activityType:'',  //活动类型
			perNum:'',   //加入人数
			activeMsg:'',
			url1:'',
			bigImg:'',
			title:""
            }

        },
        created: function () {
			$("#title").text("活动详情");
			this.$MintUI.Indicator.close();
            this.userid = this.WX_UserId;
            this.url1 = this.url;
            this.$MintUI.Indicator.open('加载中');
        },
        mounted: function () {
            var that=this;
			that.id=this.$route.query.id;
			that.msg();  //活动信息
        },
        methods: {
            msg:function(){
				var that=this;
				$.ajax({
					 type: "post",
					 url: that.port + "api/QueQiao/GetActivityById",
					 data:{
						id:that.id
					 },
					 dataType: "json",
					 success: function (res) {
						 that.$MintUI.Indicator.close();
						 if(res.returncode==0){
							 var data=JSON.parse(res.data);
							 console.log(data);
							that.title=data.activityTitle;
							that.startTime=data.activityStarDate.split(" ")[0].split("-")[0]+"."+data.activityStarDate.split(" ")[0].split("-")[1]+"."+data.activityStarDate.split(" ")[0].split("-")[2]+" "+data.activityStarDate.split(" ")[1].split(":")[0]+":"+data.activityStarDate.split(" ")[1].split(":")[1];
							that.endTime=data.activityEndDate.split(" ")[0].split("-")[0]+"."+data.activityEndDate.split(" ")[0].split("-")[1]+"."+data.activityEndDate.split(" ")[0].split("-")[2]+" "+data.activityEndDate.split(" ")[1].split(":")[0]+":"+data.activityEndDate.split(" ")[1].split(":")[1];

							that.address=data.activityAddress;
							that.activityType=data.activityType;
							that.perNum=data.activityNums;
							$("#content").html(data.activityIntroduce);
							//that.activeMsg=data.activityIntroduce;
							that.bigImg=data.activityBigImg;
						 }

					 },error:function(){
						 that.$MintUI.Indicator.close();
					 }
				 });
			},
				submit:function(){   //报名
					var that=this;
					that.$MintUI.Indicator.open("报名中");
				$.ajax({
						type: "post",
						url: that.port + "api/QueQiao/AddQueQiaoActivity",
						data:{
							userid:that.userid,
							content:that.mine,
							activityId:that.id
							},
						dataType: "json",
						success: function (res) {
							that.$MintUI.Indicator.close();
								if(res.returncode==0){
									that.$MintUI.Toast(res.msg);
									if(res.data=="0"){  //还未报名
										that.perNum+=1;
									}

									return false;
								}else{
									that.$MintUI.Toast(res.msg);
									return false;
								}

						},error:function(){
							that.$MintUI.Indicator.close();
							that.$MintUI.Toast("服务器错误");
							return false;
						}
						});

				}
		}

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "./css/activity.css";

    /*# sourceMappingURL=home.css.map */
</style>
<template>
	<div class="lPlain">
		<div id="one">
			<h5>一、功能概述</h5>
			<p style="text-indent: 2em;">为茅台集团单身员工提供一个企业内的交友平台。员工首次进入该应用时需上传自己的照片及对自己的简单描述，进入应用后可在个人信息中查看自己的信息。</p>
		</div>
		<div id="two">
			<h5>二、功能说明</h5>
			<p style="font-size: 0.7rem;color:#333;">1、个人信息完善</p>
			<p>
				&nbsp;&nbsp;&nbsp;&nbsp;个人中心->填写资料>资料确定
			</p>
			<div>
				<img v-for="item in oneImg" @click="imgShow(item)" :src="item" alt="">
			</div>
			<p class="sm">
				说明：用户进入茅台佳缘应用页面需完善自己的个人真实资料，不然无法在此应用中进行评论、私信、活动查看报名等操作，点击<img src="./images/one04.jpg" alt="">图标进入个人中心页面，点击<img src="./images/one05.jpg" alt="">按钮，进入个人资料填写页面。</p>
		</div>
		<div id="two" style="padding-top: 0;">
			<p style="font-size: 0.7rem;color:#333;">2、缘分页面</p>
			<p>
				&nbsp;&nbsp;&nbsp;&nbsp;好友列表->选择好友->查看详情
			</p>
			<div>
				<img v-for="item in twoImg" @click="imgShow(item)" :src="item" alt="">
			</div>
			<p class="sm">说明：用户完善个人资料后，点击<img style="width:1rem;" src="./images/two04.jpg" alt="">图标进入缘分页面，用户可查看所有的好友，点击<img style="width:1rem;" src="./images/two03.jpg" alt="">图标，可筛选好友，点击好友头像可查看其详细信息点击<span style="color:red;">+关注</span>可关注其为好友，点击<span style="color:red;">私信</span>可进行留言。</p>
		</div>
		<div id="two" style="padding-top: 0;">
			<p style="font-size: 0.7rem;color:#333;">3、个人中心</p>
			<p>
				&nbsp;&nbsp;&nbsp;&nbsp;发帖->活动报名->个人中心
			</p>
			<div>
				<img v-for="item in threeImg" @click="imgShow(item)" :src="item" alt="">
			</div>
			<p>说明：用户点击<img style="width:1.5rem;" src="./images/three04.jpg" alt="">图标，可发起新的动态，点击<img style="width:1.5rem;" src="./images/three05.jpg"
				 alt="">进入个人中心页面，点击<img style="width:2rem;" src="./images/three06.jpg" alt="">按钮，可进入活动列表页面点击查看活动详情，点击报名，即可完成报名，在个人中心页面可查看发布的动态、我的关注、我的粉丝等信息</p>
		</div>

		<div @click="hide" id="model" style="position: fixed;left:0;top:0;width:100%;height:100%;" v-show="show">
			<img style="width:100%;height:100%;" :src="img" alt="">
		</div>
	</div>


</template>

<script>
	export default {
		name: 'HelloWorld',
		data() {
			return {
				oneImg: [
					require("./images/one01.jpg"),
					require("./images/one02.jpg"),
					require("./images/one03.jpg")
				],
				twoImg: [
					require("./images/two01.jpg"),
					require("./images/two02.jpg")
				],
				threeImg: [
					require("./images/three01.jpg"),
					require("./images/three02.jpg"),
					require("./images/three03.jpg")
				],
				img: "",
				show: false
			}

		},
		created: function () {
			$("#title").text("功能说明");
			this.$MintUI.Indicator.close();
			this.userid = this.WX_UserId;
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
		},
		mounted: function () {
		},
		methods: {
			imgShow: function (e) {
				console.log(e);
				this.img = e;
				this.show = true;
			},
			hide: function () {
				this.img = "";
				this.show = false;
			},
			imgSize: function (e, list) {  //图片放大
				/* this.bigImage=this.url+e;
					this.imgShow=true; */
				var that = this;
				var arr = [];
				for (var i = 0; i < list.length; i++) {
					arr.push(that.url + list[i]);
				}
				wx.ready(function () {
					wx.previewImage({
						current: e, // 当前显示图片的http链接
						urls: arr // 需要预览的图片http链接列表
					});
				});
			}

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	* {
		padding: 0;
		margin: 0;
		list-style: none;
		font-family: PingFang-SC-Medium !important;
		word-break: break-all;
	}


	body {
		background-color: #f5f5f5;
		width: 100%;
	}

	#one,
	#two {
		padding: 0.5rem 0.5rem;
		background-color: #fff;
		margin-bottom: 0.5rem;
	}

	#one h5,
	#two h5 {
		font-size: 0.8rem;
		color: #333;
		margin-bottom: 0.3rem;
	}

	#two {
		margin-bottom: 0;
	}

	#one p,
	#two p {
		font-size: 0.7rem;
		color: #888;
		padding: 0.3rem 0;
	}

	#two>div {
		overflow: hidden;
		margin: 0.5rem 0;
	}

	#two>div img {
		width: 31%;
		margin: 0 1.15%;
		float: left;
	}

	#two>.sm {
		padding-bottom: 1rem;
		border-bottom: 1px solid #efefef;
	}

	#two>p img {
		width: 1rem;
		vertical-align: middle;
	}

  .lPlain{
    width: 100%;
    height: 100%;
    overflow: auto;
  }

	/*# sourceMappingURL=home.css.map */
</style>

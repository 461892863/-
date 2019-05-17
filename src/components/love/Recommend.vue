<template>
    <div id="app" v-cloak>
        <!--列表-->
        <div id="List">
            <div class="list" v-for="item in list" @click="detail(item.userid)">
                <img :src="item.img" alt="">
                <div>
                    <p class="name">{{item.name}}</p>
                    <p class="msg"><span>{{item.age}}岁&nbsp;|</span><span class="bm">&nbsp;{{item.departName}}</span><span
                            v-if="item.gender==1">&nbsp;|&nbsp;男</span><span v-if="item.gender==2">&nbsp;|&nbsp;女</span><span
                            class="marry" v-if="item.status==0">单身</span><span class="marry" v-if="item.status==1">非单身</span></p>
                    <p class="declaration"><span><img src="./images/declaration.png" alt=""><span>{{item.remark}}</span></span></p>
                </div>
            </div>
            <!--暂无数据-->
            <div style="text-align: center;margin-top: 0.5rem;" class="no_msg" v-show="list.length==0">
                <img style="width:80%;" src="./images/nodata.png" alt="">
                <p>暂无数据</p>
            </div>
        </div>
    </div>


</template>

<script>
    export default {
        name: 'HelloWorld',
        data() {
            return {
                show: false,
                sort: '0',
                sex: '',
                status: '0',
                list: [],
                sortName: '默认排序',
                age: '0',  //年龄
                ageMin: '0',  //最小年龄
                ageMax: '0',  //最大年龄
                sortSex: '0',  //性别
                dept: '',  //部门
                name: '',   //姓名
                deptSort: [],   //部门数据
                url1: ""
            }

        },
        created: function () {
            $("#title").text("推荐好友");
            this.$MintUI.Indicator.close();
            this.userid = this.WX_UserId;
            this.url1=this.url;
            this.$MintUI.Indicator.open("加载中");
        },
        mounted: function () {
            this.load();
        },
        methods: {
            load:function(){
				var that=this;
				$.ajax({
					 type: "post",
					 url: that.port + "api/QueQiao/MyPaired",
					 data:{
						userid:that.userid
					 },
					 dataType: "json",
					 success: function (res) {

						 if(res.returncode==0){
							 var data=JSON.parse(res.data);

							for(var i=0;i<data.length;i++){
								data[i].img=that.url1+data[i].img;
							}
							that.list=data;
							that.$MintUI.Indicator.close();

						 }else{
							 that.$MintUI.Indicator.close();
							 that.$MintUI.Toast(res.msg);
						 }


					 },error:function(){
						 that.$MintUI.Indicator.close();
						 that.$MintUI.Toast("服务器错误");
					 }
				 });
			},
			detail:function(e){  //跳转详情
                this.$router.push({
                    path:'/love/detailed',
                    query:{
                        id:e
                    }
                });
			}
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "./css/msgActivity.css";

    #List {
        margin-bottom: 0.3rem;
    }

    /*# sourceMappingURL=home.css.map */
</style>
;(function($){
	$.fn.lyCarousel= function(options){
		//默认值
		var defaults = {
					width:810,
					height:490,
					imgs:[],

					//默认class名
					ele:'.carousel',

					//图片间隔时间
					duration:2500,

					//滚动类型
					type:'opacity',
					//horizontal,vertical水平,fade(opacity)淡入淡出

					//自动轮播
					autoPlay:true,

					//默认索引值
					index:0,

					//是否显示前后按钮
					buutons:true,

					//是否显示页码
					page:true,

					//是否无缝滚动
					seamless:true,
		}

		//覆盖默认参数
		var opt = jQuery.extend({},defaults,options);

		var self = this;//改变this指向

		var Car = {
			init:function(opt){
				//获取到页面元素
					this.ele = self;
					// self.addClass('carousel');
					

				//将对象变成Carousel的属性
					var _this = this;
					this.opt = opt;
					this.idx = this.opt.index;
					this.len = opt.imgs.length;
					

				//根据传入图片生成结构
					let ul = document.createElement('ul');
					ul.innerHTML = opt.imgs.map(function(item){
						return `<li>
							<img src="${item}"/>
						</li>`
					}).join('');
					

					this.ele.append(ul);
					console.log('-----------lis-------')
					console.log(opt.ele)
					if(opt.ele === '.carousel'){
						this.lis = $('.food-main_3 li');
					}else{
						this.lis = $(opt.ele + ' li');
					}
					

					//默认显示this.idx对应的图片
					if(this.opt.type ==="vertical"){
						ul.style.top = -this.idx * this.opt.height+'px';	
					}else if(this.opt.type ==="horizontal"){
						ul.style.left = -this.idx * this.opt.width+'px';
					}

					if(this.opt.type ==="opacity"){
						for(var i = 0;i < this.lis.length;i++){
							if(i!=this.idx){
								this.lis[i].style.opacity = 0;
							}
						}
						// this.isOpacity();
					}
					

				//鼠标移入移除
					self.on('mouseenter',function(){
						this.stop();

					}.bind(this)).on('mouseleave', function(){
						this.start();
					}.bind(this));

				//代码执行循序（写在上面还没有创建）
					this.ul = ul;


				//无缝滚动						
				console.log(this.lis);
					if(this.opt.seamless){
						var copyLi = this.lis[0].cloneNode(true);

						console.log(this.lis[0])
						this.ul.appendChild(copyLi);
						this.len = ++this.len;
					}

				//设置页码
					if(this.opt.page){
						this.page = document.createElement('div');
						this.page.className = 'page';
						for(var i=0;i<this.len-1;i++){
							this.span = document.createElement('span');

							//添加高亮
							if(i===this.idx){
								this.span.className = 'active';
							}
							this.span.idx = i;

							this.page.appendChild(this.span);
						}
						this.ele.append(this.page);

						//获取所创建span
						this.spanAll = this.page.querySelectorAll('span');
					}

				//创建前后按钮
					if(this.opt.buutons){
						var next = document.createElement('span');
						var prev = document.createElement('span');
						next.className = 'next';
						prev.className = 'prev';
						next.innerHTML = '&gt';
						prev.innerHTML = '&lt';
						this.ele.append(next);
						this.ele.append(prev);
						next.style.opacity = 0;
						prev.style.opacity = 0;
						//鼠标移入
						self.on('mouseenter',function(){
						animate(prev,{opacity:1});
						animate(next,{opacity:1});
					}.bind(this)).on('mouseleave', function(){
						animate(prev,{opacity:0});
						animate(next,{opacity:0});
					}.bind(this));

						//绑定事件
						this.ele[0].onclick = function(e){
							e = e || window.event;
							this.stop();
							var target = e.target || e.srcElemnet;

							if(target.className.toLowerCase() === 'next'){
								this.next();
								this.pages();
								this.isOpacity();
							}else if(target.className.toLowerCase() === 'prev'){
								this.prev();
								this.pages();
								this.isOpacity();
							}else if(target.parentNode.className.toLowerCase() === 'page'){
								this.idx = target.idx;

								this.pages();
								this.move();
								this.isOpacity();
							}
						}.bind(this);
					}

				//类型等于horizontal时，给this.ele添加宽度
					if(this.opt.type === 'horizontal'){

					this.ul.style.width = this.len*this.opt.width + 'px';
					}
				
				//淡入淡出
					this.lis = this.ul.querySelectorAll('li');

					

				//判断是否自动播放
					if(this.opt.autoPlay){
						this.start();
					}
			},
			move:function(){
					//判断len的长度
					if(this.idx>=this.len){
						this.idx = 0;
						//设置无缝滚动
						if(this.opt.seamless){
							this.idx = 1;
						}
						if(this.opt.type === 'horizontal'){
							this.ul.style.left = 0;
						}else if(this.opt.type === 'vertical'){
							this.ul.style.top = 0;
						}
					}else if(this.idx<0){
						this.idx = this.len-1;
						
						//设置无缝滚动
						if(this.opt.seamless){
							this.idx = this.len-2;
						}
						if(this.opt.type === 'horizontal'){
							this.ul.style.left = (-this.len+1)*this.opt.width+'px';
						}else if(this.opt.type === 'vertical'){
							this.ul.style.top = (-this.len+1)*this.opt.height+'px';
						}
						
					}
					//用对象装需要改变的属性
					var target = {};
					if(this.opt.type ==='vertical'){
						target.top = -this.idx*this.opt.height;
					}else if(this.opt.type ==='horizontal'){
						target.left = -this.idx*this.opt.width;
					}
					//给ul添加动画
					this.ele.find('ul').animate(target);
			},
			//停止自动播放
			stop:function(){
				clearInterval(this.timer);
			},
			// 自动播放
			start:function(){
				//设置滚动
				var _this = this;
				this.timer = setInterval(
					function(){
						_this.idx++;
						_this.move();
						_this.pages();
						if(_this.opt.type === 'opacity'){
							_this.isOpacity();
						}		
				},this.opt.duration);
			},
			//上一张图片
			next:function(){
				this.idx++;
				this.move();
			},
			//下一张图片
			prev:function(){
				this.idx--;
				this.move();
			},
			//点击分页时切换到当前图片
			pages:function(){
				//清空样式
				for(var i=0;i<this.spanAll.length;i++){
					this.spanAll[i].className = '';
				}

				//判断如果等于最后一个或者等于零的时候
				if(this.idx!==this.len-1){
					this.spanAll[this.idx].className='active';
				}else if(this.idx>=this.len-1){
					this.spanAll[0].className='active';
				}else if(this.idx<=0){
					this.spanAll[this.len-2].className='active';
				}
			},
			isOpacity:function(){
				for(var i=0;i<this.len;i++){
					//定 type===opacity
					if(this.opt.type === 'opacity'){
						this.lis[i].style.position = 'absolute';
						this.lis[i].style.left = 0;
						this.lis[i].style.top = 0;
						animate(this.lis[i],{opacity:0}); 
					}
					
				}
				animate(this.lis[this.idx],{opacity:1});
			}
		}
		Car.init(opt);
	}
})(jQuery);
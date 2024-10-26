### npm install 速度慢的解决方案
```bash
//1.查看npm镜像设置  
npm config get registry  
//2.将npm设置为淘宝镜像  
npm config set registry https://registry.npmmirror.com  
//3.再次查看npm镜像设置  
npm config get registry  
//4.重新install  
npm install  
```
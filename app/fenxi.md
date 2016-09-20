发送消息：

curl
	-H 'Host: api.m.panda.tv'
	-H 'Cookie: M=t%3D1473337056%26v%3D1.0%26mt%3D1473337056%26s%3Dafad0b743d36b4b20e87cf6e8f65ad72; R=r%3D32710864%26u%3DCnaqnGi32710864%26n%3D%25R4%25O8%25N4%25R4%25O8%25NN%25R4%25O8%25NQ%25R6%2596%2587%26le%3DMJI2MJ1yWGDjZGV2YzAioD%3D%3D%26m%3DZGH2Amp5BGp5ZGD%3D%26im%3DnUE0pPHmDFHlEvHlEzx3YaOxnJ0hM3ZyZxLmAwD0BJD2AQAuZJL5MGR2ZmDkZwOwBGAyAJZ4MJSyZv5jozp%3D'
	-H 'Accept: */*'
	-H 'User-Agent: PandaTV-ios/1.1.2 (iPhone; iOS 9.3.5; Scale/3.00)'
	-H 'xiaozhangdepandatv: 1'
	-H 'Accept-Language: zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8, ja-JP;q=0.7'
	--data "__channel=appstore&__plat=ios&__version=1.1.2.1218&content=666&pt_sign=7dfa5055a28eb0813debd699f56778d5&pt_time=1474337963&roomid=337852&type=1"
	--compressed
	'http://api.m.panda.tv/ajax_send_group_msg'



RAW:

POST /ajax_send_group_msg HTTP/1.1
Host: api.m.panda.tv
Content-Type: application/x-www-form-urlencoded
Cookie: M=t%3D1473337056%26v%3D1.0%26mt%3D1473337056%26s%3Dafad0b743d36b4b20e87cf6e8f65ad72; R=r%3D32710864%26u%3DCnaqnGi32710864%26n%3D%25R4%25O8%25N4%25R4%25O8%25NN%25R4%25O8%25NQ%25R6%2596%2587%26le%3DMJI2MJ1yWGDjZGV2YzAioD%3D%3D%26m%3DZGH2Amp5BGp5ZGD%3D%26im%3DnUE0pPHmDFHlEvHlEzx3YaOxnJ0hM3ZyZxLmAwD0BJD2AQAuZJL5MGR2ZmDkZwOwBGAyAJZ4MJSyZv5jozp%3D
Content-Length: 143
Connection: keep-alive
Accept: */*
User-Agent: PandaTV-ios/1.1.2 (iPhone; iOS 9.3.5; Scale/3.00)
xiaozhangdepandatv: 1
Accept-Language: zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8, ja-JP;q=0.7
Accept-Encoding: gzip, deflate

__channel=appstore&__plat=ios&__version=1.1.2.1218&content=666&pt_sign=7dfa5055a28eb0813debd699f56778d5&pt_time=1474337963&roomid=388249&type=1


==== 分析 ====

Cookie:

	R=r=32710864&u=CnaqnGi32710864&n=%R4%O8%N4%R4%O8%NN%R4%O8%NQ%R6%96%87&le=MJI2MJ1yWGDjZGV2YzAioD==&m=ZGH2Amp5BGp5ZGD=&im=nUE0pPHmDFHlEvHlEzx3YaOxnJ0hM3ZyZxLmAwD0BJD2AQAuZJL5MGR2ZmDkZwOwBGAyAJZ4MJSyZv5jozp=

	M=t=1473337056&v=1.0&mt=1473337056&s=afad0b743d36b4b20e87cf6e8f65ad72



curl -H 'Host: api.m.panda.tv' -H 'Cookie: M=t%3D1473337056%26v%3D1.0%26mt%3D1473337056%26s%3Dafad0b743d36b4b20e87cf6e8f65ad72; R=r%3D32710864%26u%3DCnaqnGi32710864%26n%3D%25R4%25O8%25N4%25R4%25O8%25NN%25R4%25O8%25NQ%25R6%2596%2587%26le%3DMJI2MJ1yWGDjZGV2YzAioD%3D%3D%26m%3DZGH2Amp5BGp5ZGD%3D%26im%3DnUE0pPHmDFHlEvHlEzx3YaOxnJ0hM3ZyZxLmAwD0BJD2AQAuZJL5MGR2ZmDkZwOwBGAyAJZ4MJSyZv5jozp%3D' -H 'Accept: */*' -H 'User-Agent: PandaTV-ios/1.1.2 (iPhone; iOS 9.3.5; Scale/3.00)' -H 'xiaozhangdepandatv: 1' -H 'Accept-Language: zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8, ja-JP;q=0.7' --data "__channel=appstore&__plat=ios&__version=1.1.2.1218&content=666&pt_sign=d0c60d6da58bec8106b0918e0c9e2878&pt_time=1474343949&roomid=392616&type=1" --compressed 'http://api.m.panda.tv/ajax_send_group_msg'

__channel=appstore&__plat=ios&__version=1.1.2.1218&content=666&pt_sign=d0c60d6da58bec8106b0918e0c9e2878&pt_time=1474344824&roomid=392616&type=1

__channel=appstore&__plat=ios&__version=1.1.2.1218&content=感谢［秦总i］送的7800个竹子。
&pt_sign=d0c60d6da58bec8106b0918e0c9e2878&pt_time=1474343949&roomid=314497&type=1



curl -H 'Host: api.m.panda.tv' -H 'Cookie: M=t%3D1473337056%26v%3D1.0%26mt%3D1473337056%26s%3Dafad0b743d36b4b20e87cf6e8f65ad72; R=r%3D32710864%26u%3DCnaqnGi32710864%26n%3D%25R4%25O8%25N4%25R4%25O8%25NN%25R4%25O8%25NQ%25R6%2596%2587%26le%3DMJI2MJ1yWGDjZGV2YzAioD%3D%3D%26m%3DZGH2Amp5BGp5ZGD%3D%26im%3DnUE0pPHmDFHlEvHlEzx3YaOxnJ0hM3ZyZxLmAwD0BJD2AQAuZJL5MGR2ZmDkZwOwBGAyAJZ4MJSyZv5jozp%3D' -H 'Accept: */*' -H 'User-Agent: PandaTV-ios/1.1.2 (iPhone; iOS 9.3.5; Scale/3.00)' -H 'xiaozhangdepandatv: 1' -H 'Accept-Language: zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8, ja-JP;q=0.7' --data "__channel=appstore&__plat=ios&__version=1.1.2.1218&content=感谢［秦总i］送的7800个竹子。
&pt_sign=d0c60d6da58bec8106b0918e0c9e2878&pt_time=1474343949&roomid=314497&type=1" --compressed 'http://api.m.panda.tv/ajax_send_group_msg'

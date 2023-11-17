-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: k9a706.p.ssafy.io    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `model_board`
--

DROP TABLE IF EXISTS `model_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_board` (
  `model_no` int NOT NULL AUTO_INCREMENT,
  `avatar_id` varchar(255) DEFAULT NULL,
  `common_video_path` varchar(255) DEFAULT NULL,
  `conversation_count` int DEFAULT NULL,
  `conversation_text` text,
  `ele_voice_id` varchar(255) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `hey_voice_id` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `latest_conversation_time` timestamp NULL DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `user_no` int DEFAULT NULL,
  `common_holo_path` varchar(255) DEFAULT NULL,
  `moving_holo_path` varchar(255) DEFAULT NULL,
  `moving_video_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`model_no`),
  KEY `FK4u5h7ocqxb1w159m80bj08uit` (`user_no`),
  CONSTRAINT `FK4u5h7ocqxb1w159m80bj08uit` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_board`
--

LOCK TABLES `model_board` WRITE;
/*!40000 ALTER TABLE `model_board` DISABLE KEYS */;
INSERT INTO `model_board` VALUES (51,'3128a44ae9154c86af97297366b4a272','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/135/1.mp4',330,'나 : 2023. 10. 17. 오전 11:05\n상대방 : 제가 강남으로 갈까요?\n나 : 전 위치는 다 정말 괜찮아요 ㅎ\n나 : 오전에 할 일이 좀 있어서 아마 어디든 가게되면 한2~3시쯤 가있을듯한데\n나 : 고럼 간단하게 승우님 저녁쯤 잠깐뵙고 저녁+간맥\n나 : 어떠신가영\n상대방 : 그래염\n상대방 : 어디서 볼지만\n상대방 : ㅋㅋ\n나 : 이따 고럼 강남쪽 가있겠습니당\n상대방 : 네넹\n상대방 : 저 카페에서\n상대방 : 롤챔스 보고 있겠읍니다\n상대방 : ㅋㅋㅋㅋ\n나 : 엥? ㅋㅋㅋㅋㅋㅋ\n나 : 저 지금 강남가는중인데\n나 : 벌써 가셨어요?? ㅋㅋㅋ\n상대방 : 저 지금 교대역이라\n상대방 : 일찍가서 공부좀 할까 했는데\n상대방 : 생각해보니 오늘이 결승이더라구요\n나 : 아하 ㅋㅋㅋㅋㅋ ㅋㅋㅋㅋ 저도 지금 유혹에 흔들리고있어요\n나 : 위치 알려주시면 거기로 가겠습니당\n상대방 : 아마 커피빈 가지 않을까 싶어요\n나 : 저녁 6시 좀 넘어서 먹어도 괜찮으신가요...??\n상대방 : 저 먹은지 얼마안되서\n상대방 : 괜찮아요\n나 : 좋습니당\n나 : 이모티콘 \n상대방 : 12번 출구 커피빈에 있을게요\n나 : 47000 23000원만 보내주세영\n나 : 덕분에 주말 알찼습니다 ㅎㅎ\n나 : 이모티콘 담엔 재영님 불러서 같이 뵈여!\n상대방 : 23,500원을 보냈어요. 송금 받기 전까지 보낸 분은 내역 상세 화면에서 취소할 수 있어요.\n상대방 : 이번주에요?\n상대방 : ㅋㅋㅋㅋ\n나 : ㅋㅋㅋㅋㅋ 전 좋습니다 ㅋㄷㅋㄷ\n나 : 23,500원 받기 완료! 받은 카카오페이머니는 송금 및 온/오프라인 결제도 가능해요.','QSoVFheCrI3dK4IKPDKa','F','086b225655694cd9ae60e712469ce474','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/51/kimseungwoo.png','2023-11-16 20:54:14','김승우1',4,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/51/holo_video.mp4','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/51/holo_moving.mp4','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/135/2.mp4'),(77,'7a01443e8db343b79517ca5c0c635c08',NULL,62,'나 : 2023. 10. 17. 오전 11:05\n상대방 : 제가 강남으로 갈까요?\n나 : 전 위치는 다 정말 괜찮아요 ㅎ\n나 : 오전에 할 일이 좀 있어서 아마 어디든 가게되면 한2~3시쯤 가있을듯한데\n나 : 고럼 간단하게 승우님 저녁쯤 잠깐뵙고 저녁+간맥\n나 : 어떠신가영\n상대방 : 그래염\n상대방 : 어디서 볼지만\n상대방 : ㅋㅋ\n나 : 이따 고럼 강남쪽 가있겠습니당\n상대방 : 네넹\n상대방 : 저 카페에서\n상대방 : 롤챔스 보고 있겠읍니다\n상대방 : ㅋㅋㅋㅋ\n나 : 엥? ㅋㅋㅋㅋㅋㅋ\n나 : 저 지금 강남가는중인데\n나 : 벌써 가셨어요?? ㅋㅋㅋ\n상대방 : 저 지금 교대역이라\n상대방 : 일찍가서 공부좀 할까 했는데\n상대방 : 생각해보니 오늘이 결승이더라구요\n나 : 아하 ㅋㅋㅋㅋㅋ ㅋㅋㅋㅋ 저도 지금 유혹에 흔들리고있어요\n나 : 위치 알려주시면 거기로 가겠습니당\n상대방 : 아마 커피빈 가지 않을까 싶어요\n나 : 저녁 6시 좀 넘어서 먹어도 괜찮으신가요...??\n상대방 : 저 먹은지 얼마안되서\n상대방 : 괜찮아요\n나 : 좋습니당\n나 : 이모티콘 \n상대방 : 12번 출구 커피빈에 있을게요\n나 : 47000 23000원만 보내주세영\n나 : 덕분에 주말 알찼습니다 ㅎㅎ\n나 : 이모티콘 담엔 재영님 불러서 같이 뵈여!\n상대방 : 23,500원을 보냈어요. 송금 받기 전까지 보낸 분은 내역 상세 화면에서 취소할 수 있어요.\n상대방 : 이번주에요?\n상대방 : ㅋㅋㅋㅋ\n나 : ㅋㅋㅋㅋㅋ 전 좋습니다 ㅋㄷㅋㄷ\n나 : 23,500원 받기 완료! 받은 카카오페이머니는 송금 및 온/오프라인 결제도 가능해요.','CfpZ7JO0JqdVm0YFkTg7','F','086b225655694cd9ae60e712469ce474','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/77/aimyon_11.jpg','2023-11-16 12:36:10','임병국',4,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/77/holo_video.mp4','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/77/holo_video.mp4',NULL),(132,'8cecfe24401d499eb2a01a21e9bb151a','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/1.mp4',27,'나 : 2023년 11월 12일 오후 7:37\n나 : 나도 여 이제 밥먹으러 나와서 안걸어도 괜찮~\n상대방 : 응  맛저^^\n상대방 : 정읍은 계속 내리는 눈으로 고립상태다 ㅎㅎ\n상대방 : 사진\n나 : 우와 많이 왔네\n상대방 : 사진\n상대방 : 고구마튀김 맛나게 하는데 먹을 아들이 없네 ㅠ\n나 : 아껴두소 먹으러갈꺼니까\n나 : 토요일에갈게 엄마\n상대방 : 이번주?\n나 : ㅇㅇ\n상대방 : 오키\n나 : 1 정도 됬다던데\n나 : 십몇 대 일\n나 : 토요일에 가서 말할까했었는데\n나 : 사진\n상대방 : 오~~~~~~~~~\n나 : 발표 일주일정도 걸린다길래 어제나 그제 뜨나했는데\n나 : 전화 와요\n나 : 이제봣네\n상대방 : 전화를해봐\n나 : 급한거아님 나중에함\n상대방 : 그래\n상대방 : 3007번 버스 노선 정보, 수원버스터미널 ↔ 강남역, 역삼세무서\n상대방 : 참고\n상대방 : 수원에서 다니는게 나을거같다\n나 : 엄마 그만 찾아봐도돼 ㅋㅋㅋ\n상대방 : 응\n나 : 교통편 여기서 나름 몇년살았는데\n나 : 저거 다 알아유\n상대방 : 응\n나 : 그래도 고맙고\n나 : 기차 예매성공스\n나 : 5시반쯤\n나 : 갈듯 내일\n상대방 : 택시도 안다녀 여기 ㅠ\n상대방 : 동영상\n나 : 4시50분도착이네 내일\n나 : 택시타고 집가면 5시반쯤 일듯함\n나 : 기차 5시반도착인줄알았는데 시간 잘못기억했던듯 4시 47분도착\n상대방 : 오키\n상대방 : 먹고싶은 음식있냐\n나 : 고구마튀김\n나 : 가족이랑 맥주한잔\n상대방 : 연락처: 내장산콜\n상대방 : 콜 되냐?\n상대방 : 택시 있어?\n나 : 터미널까지옴 ㅇㅇ\n상대방 : 택시는있고?\n나 : 집에 맥주있음?\n상대방 : 응\n나 : 허허\n상대방 : 오기나혀 얼릉\n나 : ㅇㅇ 차가 느릿느릿 조심히다니더라 다\n나 : \'좋은 밤 좋은 꿈-너드커넥션 (Nerd Connection)\' 음악을 공유했습니다.\n나 : 일단 잘 탔고\n나 : 난 꿀잠잡니다\n상대방 : 그래\n나 : 도착\n나 : 이모티콘\n상대방 : 고생했네\n나 : 이모티콘\n상대방 : 저녁먹었노\n나 : 탕짜면으로 중식으로\n나 : 점심에 게장 맛잇더라\n상대방 : 굿!\n나 : 바디워시\n나 : 몇일 배송예정인감?\n상대방 : 오늘아님 내일\n상대방 : 왜?\n나 : 그냥 물어봄\n나 : 오면 잘 쓸라고\n상대방 : 아\n상대방 : 샤워자주하면 그때마다 비누칠하지말고 한번정도는 미지근한물로 가볍게해\n나 : 오키오키 아침 저녁\n나 : 2번합니다\n나 : 가볍게~\n상대방 : 유산균은 아침공복에 먹어라\n나 : 안그래도 그때 엄마말듣고\n나 : 오늘이랑 아침에 일어나서 바로바로 먹음 ㅋㄷ\n상대방 : 굿\n나 : 배송 오늘 온다고 연락왔어\n상대방 : 응\n상대방 : 잘발러\n나 : 바지 하나 샀었는데\n나 : 그거 월요일에 여기와서 주문했는데 그거랑 같이올것같으\n나 : 바디로션이랑\n상대방 : 바디로션 엄마꺼를 더늦게시켰는데 어제옴\n나 : 경기권 재고가 없었나보네 근처 집하장에\n나 : 오늘 샤워하고 써볼게 이따 밤에\n나 : 로션 받았스\n상대방 : 오키\n상대방 : 꼭지 파손안되고 잘왔나 확인해\n나 : 말짱한듯\n나 : 바디로션\n나 : 이모티콘\n나 : 되게 촉촉하고 좋더라\n상대방 : 다행이네\n상대방 : 과일 먹을거있어?\n나 : 집 내려가기 전에\n나 : 있던 귤 다먹어서 없긴한데\n나 : 집앞 과일가게 가봐야겠다 하나.먹고싶어짐\n상대방 : 귤 보내줄께\n나 : 괜춘괜춘\n나 : 소규모로 사서 먹으면돼 귤말고 다른거있으면 먹어보게\n상대방 : 그래\n나 : 귤 너므 많이먹음\n나 : 이모티콘\n나 : 오리엔테이션 오프라인으로 왔네\n나 : 가야긋다 그날\n나 : 그리고 바로 시작이구만 4일부터\n상대방 : 잘다녀와서 알려줘~^^\n나 : 감 말랭이\n나 : 사왔어 먹으려고\n상대방 : ㅎㅎ그래','14VlzCHPZ7zXD46VWDJq','F','086b225655694cd9ae60e712469ce474','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/mom.png','2023-11-16 21:32:06','엄마',4,NULL,NULL,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/1.mp4'),(133,'9d8d4e67806345a5808ecdf972845169',NULL,11,'나 : 2023년 11월 12일 오후 7:37\n나 : 나도 여 이제 밥먹으러 나와서 안걸어도 괜찮~\n상대방 : 응  맛저^^\n상대방 : 정읍은 계속 내리는 눈으로 고립상태다 ㅎㅎ\n상대방 : 사진\n나 : 우와 많이 왔네\n상대방 : 사진\n상대방 : 고구마튀김 맛나게 하는데 먹을 아들이 없네 ㅠ\n나 : 아껴두소 먹으러갈꺼니까\n나 : 토요일에갈게 엄마\n상대방 : 이번주?\n나 : ㅇㅇ\n상대방 : 오키\n나 : 1 정도 됬다던데\n나 : 십몇 대 일\n나 : 토요일에 가서 말할까했었는데\n나 : 사진\n상대방 : 오~~~~~~~~~\n나 : 발표 일주일정도 걸린다길래 어제나 그제 뜨나했는데\n나 : 전화 와요\n나 : 이제봣네\n상대방 : 전화를해봐\n나 : 급한거아님 나중에함\n상대방 : 그래\n상대방 : 3007번 버스 노선 정보, 수원버스터미널 ↔ 강남역, 역삼세무서\n상대방 : 참고\n상대방 : 수원에서 다니는게 나을거같다\n나 : 엄마 그만 찾아봐도돼 ㅋㅋㅋ\n상대방 : 응\n나 : 교통편 여기서 나름 몇년살았는데\n나 : 저거 다 알아유\n상대방 : 응\n나 : 그래도 고맙고\n나 : 기차 예매성공스\n나 : 5시반쯤\n나 : 갈듯 내일\n상대방 : 택시도 안다녀 여기 ㅠ\n상대방 : 동영상\n나 : 4시50분도착이네 내일\n나 : 택시타고 집가면 5시반쯤 일듯함\n나 : 기차 5시반도착인줄알았는데 시간 잘못기억했던듯 4시 47분도착\n상대방 : 오키\n상대방 : 먹고싶은 음식있냐\n나 : 고구마튀김\n나 : 가족이랑 맥주한잔\n상대방 : 연락처: 내장산콜\n상대방 : 콜 되냐?\n상대방 : 택시 있어?\n나 : 터미널까지옴 ㅇㅇ\n상대방 : 택시는있고?\n나 : 집에 맥주있음?\n상대방 : 응\n나 : 허허\n상대방 : 오기나혀 얼릉\n나 : ㅇㅇ 차가 느릿느릿 조심히다니더라 다\n나 : \'좋은 밤 좋은 꿈-너드커넥션 (Nerd Connection)\' 음악을 공유했습니다.\n나 : 일단 잘 탔고\n나 : 난 꿀잠잡니다\n상대방 : 그래\n나 : 도착\n나 : 이모티콘\n상대방 : 고생했네\n나 : 이모티콘\n상대방 : 저녁먹었노\n나 : 탕짜면으로 중식으로\n나 : 점심에 게장 맛잇더라\n상대방 : 굿!\n나 : 바디워시\n나 : 몇일 배송예정인감?\n상대방 : 오늘아님 내일\n상대방 : 왜?\n나 : 그냥 물어봄\n나 : 오면 잘 쓸라고\n상대방 : 아\n상대방 : 샤워자주하면 그때마다 비누칠하지말고 한번정도는 미지근한물로 가볍게해\n나 : 오키오키 아침 저녁\n나 : 2번합니다\n나 : 가볍게~\n상대방 : 유산균은 아침공복에 먹어라\n나 : 안그래도 그때 엄마말듣고\n나 : 오늘이랑 아침에 일어나서 바로바로 먹음 ㅋㄷ\n상대방 : 굿\n나 : 배송 오늘 온다고 연락왔어\n상대방 : 응\n상대방 : 잘발러\n나 : 바지 하나 샀었는데\n나 : 그거 월요일에 여기와서 주문했는데 그거랑 같이올것같으\n나 : 바디로션이랑\n상대방 : 바디로션 엄마꺼를 더늦게시켰는데 어제옴\n나 : 경기권 재고가 없었나보네 근처 집하장에\n나 : 오늘 샤워하고 써볼게 이따 밤에\n나 : 로션 받았스\n상대방 : 오키\n상대방 : 꼭지 파손안되고 잘왔나 확인해\n나 : 말짱한듯\n나 : 바디로션\n나 : 이모티콘\n나 : 되게 촉촉하고 좋더라\n상대방 : 다행이네\n상대방 : 과일 먹을거있어?\n나 : 집 내려가기 전에\n나 : 있던 귤 다먹어서 없긴한데\n나 : 집앞 과일가게 가봐야겠다 하나.먹고싶어짐\n상대방 : 귤 보내줄께\n나 : 괜춘괜춘\n나 : 소규모로 사서 먹으면돼 귤말고 다른거있으면 먹어보게\n상대방 : 그래\n나 : 귤 너므 많이먹음\n나 : 이모티콘\n나 : 오리엔테이션 오프라인으로 왔네\n나 : 가야긋다 그날\n나 : 그리고 바로 시작이구만 4일부터\n상대방 : 잘다녀와서 알려줘~^^\n나 : 감 말랭이\n나 : 사왔어 먹으려고\n상대방 : ㅎㅎ그래','A9S3rQoB4oPG3fPrQ5fW','F','a5813a0982b446e9bb9a3edcdb5eced5','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/133/mom.png','2023-11-16 19:58:41','오늘의엄마',4,NULL,NULL,NULL),(137,'ddb95c2e1c1b4589ab0691d624e0b79c','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/135/1.mp4',19,'나 : 2023년 11월 16일 오후 2:19\n상대방 : 긴장말고 잘 하고 오길 화이팅 가자아!\n나 : ㅌㅎ론끝\n나 : 미쳤다..\n상대방 : 병국님\n상대방 : 쉬고있나영\n나 : 넵 무심일인가요!!!\n상대방 : 낼까지 쓸 자소서가 많길래\n상대방 : 집에서 혹쉬 자소서 쓰고있음 게더 물어볼라했어영 ㅎㅋㅋ\n나 : 하 써야하는데\n나 : 쓰고잇어요지금…?\n나 : 오늘은패슈.. 세메스..?\n상대방 : 빨래 후 풀 휴식중..\n상대방 : 메디슨 세메스 2개 쓸까 고민중... 자기전에 인적사항만 적고 낼 하나 골라서 쓸듯해여 ㅋㅋ\n상대방 : 면접 느낌은 괜찮았어여?\n나 : 저도세메스…일단\n나 : 반도체\n나 : 억지로라도짜내야지…\n나 : 면접\n나 : 토론에서망한거같고…\n나 : 직무는 그냥보긴봣는데약간 거짓말걸린것같기두..\n나 : 내일회식각나와요..?안나오면 공부 ㄱ ..?\n상대방 : 느낌만 들었음 됬다..! 고생 많았어여 진짜로\n상대방 : 낼 할거 좀 많긴한데 낮에 잘 끝내면 나올수도?!\n상대방 : 아님 공부ㄷㅎ 전 좋아영\n나 : 후 땀범벅 찐 ,, ㅋㅋㅋㅋ 더웟어요\n나 : 오키,, \n나 : 각 봅시다..\n나 : 유씨씨가주아,,\n나 : 놋북을 챙길까말까 생각즁,, \n상대방 : 낼 아침에 많이 해놓겠습니당 이것저것 오늘 디버깅한게 좀 있어숴!\n상대방 : 오전에 영상까지 다 끝내고 오후에 ucc 찍고 이제 발표준비 고우!\n상대방 : 놋북은... 튼튼병국님은 챙겨도 안챙겨도 무게는 괜찮...나? 전 항상들고다니긴해서 ㅋㅅㅋㅣㅣ\n나 : 후 바쁘겠군 , , ,\n나 : 아니면그냥\n나 : 빌려야지여기꺼,,\n나 : 후\n나 : 세메스,,\n나 : 저느 삼성이랑 문항같은줄알았는데..\n나 : 다르네...\n나 : 삼 메디슨이 비슷하고,,\n상대방 : ㅋㅋㅋㅋ.. 다 항목이 또 대충쓰긴힘들어서 하..\n상대방 : 집중해서 써야하는데\n상대방 : ㅋㅋ 저도 시간보고 정하려구요\n상대방 : 다시 자소서 열정찾아야해..!\n상대방 : 승우님 베이글코드..!\n상대방 : 사진\n나 : 후\n나 : 내일\n나 : 들려오겟고만…\n나 : 아\n나 : 자소서진짜써야해…\n나 : 계속해서기다려야해………..\n나 : 내일 오케이\n나 : 저나준다는데유선.. 난 안오겟지..\n상대방 : 후 김칫국까진 아니어도\n상대방 : 적당한 기대 가지고 가보져! 병국님은 올거임!\n상대방 : 이번주 3일만 더 화이팅 해봅시다!!\n나 : 후\n나 : 달려봅시돠ㅏㅏㅏㅏ\n나 : 컨디션좋게 내일 고우!','wnqyAa78XdLa3dMjHr4r','F','a5813a0982b446e9bb9a3edcdb5eced5','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/mw.png','2023-11-16 21:02:01','이민웅',4,NULL,NULL,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/135/2.mp4'),(138,'495e6382d27f4fb596ad7d4bf02ff40c','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/135/1.mp4',11,'나 : 2023년 11월 16일 오후 2:19\n상대방 : 긴장말고 잘 하고 오길 화이팅 가자아!\n나 : ㅌㅎ론끝\n나 : 미쳤다..\n상대방 : 병국님\n상대방 : 쉬고있나영\n나 : 넵 무심일인가요!!!\n상대방 : 낼까지 쓸 자소서가 많길래\n상대방 : 집에서 혹쉬 자소서 쓰고있음 게더 물어볼라했어영 ㅎㅋㅋ\n나 : 하 써야하는데\n나 : 쓰고잇어요지금…?\n나 : 오늘은패슈.. 세메스..?\n상대방 : 빨래 후 풀 휴식중..\n상대방 : 메디슨 세메스 2개 쓸까 고민중... 자기전에 인적사항만 적고 낼 하나 골라서 쓸듯해여 ㅋㅋ\n상대방 : 면접 느낌은 괜찮았어여?\n나 : 저도세메스…일단\n나 : 반도체\n나 : 억지로라도짜내야지…\n나 : 면접\n나 : 토론에서망한거같고…\n나 : 직무는 그냥보긴봣는데약간 거짓말걸린것같기두..\n나 : 내일회식각나와요..?안나오면 공부 ㄱ ..?\n상대방 : 느낌만 들었음 됬다..! 고생 많았어여 진짜로\n상대방 : 낼 할거 좀 많긴한데 낮에 잘 끝내면 나올수도?!\n상대방 : 아님 공부ㄷㅎ 전 좋아영\n나 : 후 땀범벅 찐 ,, ㅋㅋㅋㅋ 더웟어요\n나 : 오키,, \n나 : 각 봅시다..\n나 : 유씨씨가주아,,\n나 : 놋북을 챙길까말까 생각즁,, \n상대방 : 낼 아침에 많이 해놓겠습니당 이것저것 오늘 디버깅한게 좀 있어숴!\n상대방 : 오전에 영상까지 다 끝내고 오후에 ucc 찍고 이제 발표준비 고우!\n상대방 : 놋북은... 튼튼병국님은 챙겨도 안챙겨도 무게는 괜찮...나? 전 항상들고다니긴해서 ㅋㅅㅋㅣㅣ\n나 : 후 바쁘겠군 , , ,\n나 : 아니면그냥\n나 : 빌려야지여기꺼,,\n나 : 후\n나 : 세메스,,\n나 : 저느 삼성이랑 문항같은줄알았는데..\n나 : 다르네...\n나 : 삼 메디슨이 비슷하고,,\n상대방 : ㅋㅋㅋㅋ.. 다 항목이 또 대충쓰긴힘들어서 하..\n상대방 : 집중해서 써야하는데\n상대방 : ㅋㅋ 저도 시간보고 정하려구요\n상대방 : 다시 자소서 열정찾아야해..!\n상대방 : 승우님 베이글코드..!\n상대방 : 사진\n나 : 후\n나 : 내일\n나 : 들려오겟고만…\n나 : 아\n나 : 자소서진짜써야해…\n나 : 계속해서기다려야해………..\n나 : 내일 오케이\n나 : 저나준다는데유선.. 난 안오겟지..\n상대방 : 후 김칫국까진 아니어도\n상대방 : 적당한 기대 가지고 가보져! 병국님은 올거임!\n상대방 : 이번주 3일만 더 화이팅 해봅시다!!\n나 : 후\n나 : 달려봅시돠ㅏㅏㅏㅏ\n나 : 컨디션좋게 내일 고우!','pwaQOLVA5lXfso3XDqGa','F','a5813a0982b446e9bb9a3edcdb5eced5','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/3/138/mw.png','2023-11-16 16:48:54','민웅',3,NULL,NULL,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/135/2.mp4'),(140,'b76597cab97947b9b23bddb1bedffed2','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/1.mp4',9,'나 : 2023년 11월 12일 오후 7:37\n나 : 나도 여 이제 밥먹으러 나와서 안걸어도 괜찮~\n상대방 : 응  맛저^^\n상대방 : 정읍은 계속 내리는 눈으로 고립상태다 ㅎㅎ\n상대방 : 사진\n나 : 우와 많이 왔네\n상대방 : 사진\n상대방 : 고구마튀김 맛나게 하는데 먹을 아들이 없네 ㅠ\n나 : 아껴두소 먹으러갈꺼니까\n나 : 토요일에갈게 엄마\n상대방 : 이번주?\n나 : ㅇㅇ\n상대방 : 오키\n나 : 1 정도 됬다던데\n나 : 십몇 대 일\n나 : 토요일에 가서 말할까했었는데\n나 : 사진\n상대방 : 오~~~~~~~~~\n나 : 발표 일주일정도 걸린다길래 어제나 그제 뜨나했는데\n나 : 전화 와요\n나 : 이제봣네\n상대방 : 전화를해봐\n나 : 급한거아님 나중에함\n상대방 : 그래\n상대방 : 3007번 버스 노선 정보, 수원버스터미널 ↔ 강남역, 역삼세무서\n상대방 : 참고\n상대방 : 수원에서 다니는게 나을거같다\n나 : 엄마 그만 찾아봐도돼 ㅋㅋㅋ\n상대방 : 응\n나 : 교통편 여기서 나름 몇년살았는데\n나 : 저거 다 알아유\n상대방 : 응\n나 : 그래도 고맙고\n나 : 기차 예매성공스\n나 : 5시반쯤\n나 : 갈듯 내일\n상대방 : 택시도 안다녀 여기 ㅠ\n상대방 : 동영상\n나 : 4시50분도착이네 내일\n나 : 택시타고 집가면 5시반쯤 일듯함\n나 : 기차 5시반도착인줄알았는데 시간 잘못기억했던듯 4시 47분도착\n상대방 : 오키\n상대방 : 먹고싶은 음식있냐\n나 : 고구마튀김\n나 : 가족이랑 맥주한잔\n상대방 : 연락처: 내장산콜\n상대방 : 콜 되냐?\n상대방 : 택시 있어?\n나 : 터미널까지옴 ㅇㅇ\n상대방 : 택시는있고?\n나 : 집에 맥주있음?\n상대방 : 응\n나 : 허허\n상대방 : 오기나혀 얼릉\n나 : ㅇㅇ 차가 느릿느릿 조심히다니더라 다\n나 : \'좋은 밤 좋은 꿈-너드커넥션 (Nerd Connection)\' 음악을 공유했습니다.\n나 : 일단 잘 탔고\n나 : 난 꿀잠잡니다\n상대방 : 그래\n나 : 도착\n나 : 이모티콘\n상대방 : 고생했네\n나 : 이모티콘\n상대방 : 저녁먹었노\n나 : 탕짜면으로 중식으로\n나 : 점심에 게장 맛잇더라\n상대방 : 굿!\n나 : 바디워시\n나 : 몇일 배송예정인감?\n상대방 : 오늘아님 내일\n상대방 : 왜?\n나 : 그냥 물어봄\n나 : 오면 잘 쓸라고\n상대방 : 아\n상대방 : 샤워자주하면 그때마다 비누칠하지말고 한번정도는 미지근한물로 가볍게해\n나 : 오키오키 아침 저녁\n나 : 2번합니다\n나 : 가볍게~\n상대방 : 유산균은 아침공복에 먹어라\n나 : 안그래도 그때 엄마말듣고\n나 : 오늘이랑 아침에 일어나서 바로바로 먹음 ㅋㄷ\n상대방 : 굿\n나 : 배송 오늘 온다고 연락왔어\n상대방 : 응\n상대방 : 잘발러\n나 : 바지 하나 샀었는데\n나 : 그거 월요일에 여기와서 주문했는데 그거랑 같이올것같으\n나 : 바디로션이랑\n상대방 : 바디로션 엄마꺼를 더늦게시켰는데 어제옴\n나 : 경기권 재고가 없었나보네 근처 집하장에\n나 : 오늘 샤워하고 써볼게 이따 밤에\n나 : 로션 받았스\n상대방 : 오키\n상대방 : 꼭지 파손안되고 잘왔나 확인해\n나 : 말짱한듯\n나 : 바디로션\n나 : 이모티콘\n나 : 되게 촉촉하고 좋더라\n상대방 : 다행이네\n상대방 : 과일 먹을거있어?\n나 : 집 내려가기 전에\n나 : 있던 귤 다먹어서 없긴한데\n나 : 집앞 과일가게 가봐야겠다 하나.먹고싶어짐\n상대방 : 귤 보내줄께\n나 : 괜춘괜춘\n나 : 소규모로 사서 먹으면돼 귤말고 다른거있으면 먹어보게\n상대방 : 그래\n나 : 귤 너므 많이먹음\n나 : 이모티콘\n나 : 오리엔테이션 오프라인으로 왔네\n나 : 가야긋다 그날\n나 : 그리고 바로 시작이구만 4일부터\n상대방 : 잘다녀와서 알려줘~^^\n나 : 감 말랭이\n나 : 사왔어 먹으려고\n상대방 : ㅎㅎ그래','O6549IrdJ9pwAaFlUlsq','F','a5813a0982b446e9bb9a3edcdb5eced5','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/mom.png','2023-11-17 08:33:05','우리엄마',4,NULL,NULL,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/1.mp4');
/*!40000 ALTER TABLE `model_board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produced_video`
--

DROP TABLE IF EXISTS `produced_video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produced_video` (
  `pro_video_no` int NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NULL DEFAULT NULL,
  `holo_path` varchar(255) DEFAULT NULL,
  `pro_video_name` varchar(255) DEFAULT NULL,
  `video_path` varchar(255) DEFAULT NULL,
  `model_no` int NOT NULL,
  PRIMARY KEY (`pro_video_no`),
  KEY `FKs46efkgrmxod7klrqprdhbfdv` (`model_no`),
  CONSTRAINT `FKs46efkgrmxod7klrqprdhbfdv` FOREIGN KEY (`model_no`) REFERENCES `model_board` (`model_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produced_video`
--

LOCK TABLES `produced_video` WRITE;
/*!40000 ALTER TABLE `produced_video` DISABLE KEYS */;
/*!40000 ALTER TABLE `produced_video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produced_voice`
--

DROP TABLE IF EXISTS `produced_voice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produced_voice` (
  `pro_voice_no` int NOT NULL AUTO_INCREMENT,
  `created_time` timestamp NULL DEFAULT NULL,
  `pro_voice_name` varchar(255) DEFAULT NULL,
  `voice_path` varchar(255) DEFAULT NULL,
  `model_no` int NOT NULL,
  PRIMARY KEY (`pro_voice_no`),
  KEY `FKqnr05fq0stdkugamdf1j7duq` (`model_no`),
  CONSTRAINT `FKqnr05fq0stdkugamdf1j7duq` FOREIGN KEY (`model_no`) REFERENCES `model_board` (`model_no`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=278 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produced_voice`
--

LOCK TABLES `produced_voice` WRITE;
/*!40000 ALTER TABLE `produced_voice` DISABLE KEYS */;
INSERT INTO `produced_voice` VALUES (1,'2023-11-16 12:34:17','god승우','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/51/1/merged_audio.mp3',51),(18,'2023-11-16 13:07:14',NULL,NULL,51),(19,'2023-11-16 13:07:31',NULL,NULL,51),(20,'2023-11-16 13:08:12',NULL,NULL,51),(21,'2023-11-16 13:08:55',NULL,NULL,51),(23,'2023-11-16 13:21:25','엄마와의대화','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/23/merged_audio.mp3',132),(24,'2023-11-16 13:24:53',NULL,NULL,132),(25,'2023-11-16 13:26:13',NULL,NULL,51),(26,'2023-11-16 13:36:32','오늘 엄마와의 대화 1','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/133/26/merged_audio.mp3',133),(27,'2023-11-16 13:39:17',NULL,NULL,132),(28,'2023-11-16 13:39:38',NULL,NULL,51),(29,'2023-11-16 13:42:08',NULL,NULL,51),(30,'2023-11-16 13:43:08',NULL,NULL,51),(31,'2023-11-16 13:44:23',NULL,NULL,132),(32,'2023-11-16 13:44:33',NULL,NULL,51),(33,'2023-11-16 13:45:38',NULL,NULL,132),(34,'2023-11-16 13:46:15',NULL,NULL,51),(35,'2023-11-16 14:24:47',NULL,NULL,51),(36,'2023-11-16 14:24:47',NULL,NULL,51),(37,'2023-11-16 14:28:16',NULL,NULL,51),(38,'2023-11-16 14:28:16',NULL,NULL,51),(39,'2023-11-16 14:47:22',NULL,NULL,51),(40,'2023-11-16 14:47:22',NULL,NULL,51),(41,'2023-11-16 14:54:01',NULL,NULL,51),(42,'2023-11-16 14:54:01',NULL,NULL,51),(43,'2023-11-16 14:55:06',NULL,NULL,51),(44,'2023-11-16 14:55:06',NULL,NULL,51),(45,'2023-11-16 15:06:09',NULL,NULL,51),(46,'2023-11-16 15:06:09',NULL,NULL,51),(47,'2023-11-16 15:06:12',NULL,NULL,51),(48,'2023-11-16 15:06:12',NULL,NULL,51),(49,'2023-11-16 15:08:23',NULL,NULL,51),(50,'2023-11-16 15:08:23',NULL,NULL,51),(92,'2023-11-16 15:36:50',NULL,NULL,51),(93,'2023-11-16 15:36:50',NULL,NULL,51),(121,'2023-11-16 15:51:02',NULL,NULL,51),(122,'2023-11-16 15:51:02',NULL,NULL,51),(123,'2023-11-16 15:51:18',NULL,NULL,51),(124,'2023-11-16 15:51:18',NULL,NULL,51),(125,'2023-11-16 15:51:21',NULL,NULL,51),(126,'2023-11-16 15:51:21',NULL,NULL,51),(127,'2023-11-16 15:51:22',NULL,NULL,51),(128,'2023-11-16 15:51:22',NULL,NULL,51),(129,'2023-11-16 15:54:40',NULL,NULL,51),(130,'2023-11-16 15:55:37',NULL,NULL,51),(131,'2023-11-16 15:55:37',NULL,NULL,51),(132,'2023-11-16 15:59:04',NULL,NULL,51),(133,'2023-11-16 15:59:04',NULL,NULL,51),(138,'2023-11-16 16:03:34',NULL,NULL,51),(139,'2023-11-16 16:03:34',NULL,NULL,51),(140,'2023-11-16 16:07:26',NULL,NULL,51),(141,'2023-11-16 16:07:26',NULL,NULL,51),(142,'2023-11-16 16:07:44',NULL,NULL,51),(143,'2023-11-16 16:07:44',NULL,NULL,51),(144,'2023-11-16 16:10:12',NULL,NULL,51),(145,'2023-11-16 16:10:12',NULL,NULL,51),(146,'2023-11-16 16:10:39',NULL,NULL,51),(147,'2023-11-16 16:10:39',NULL,NULL,51),(148,'2023-11-16 16:14:42',NULL,NULL,51),(149,'2023-11-16 16:14:42',NULL,NULL,51),(150,'2023-11-16 16:16:01',NULL,NULL,51),(151,'2023-11-16 16:16:01',NULL,NULL,51),(152,'2023-11-16 16:17:10',NULL,NULL,51),(153,'2023-11-16 16:17:10',NULL,NULL,51),(154,'2023-11-16 16:18:07',NULL,NULL,51),(155,'2023-11-16 16:18:07',NULL,NULL,51),(156,'2023-11-16 16:18:31',NULL,NULL,51),(157,'2023-11-16 16:18:31',NULL,NULL,51),(158,'2023-11-16 16:18:56',NULL,NULL,51),(159,'2023-11-16 16:18:56',NULL,NULL,51),(164,'2023-11-16 16:23:34',NULL,NULL,51),(165,'2023-11-16 16:23:34',NULL,NULL,51),(167,'2023-11-16 16:24:10',NULL,NULL,51),(168,'2023-11-16 16:24:10',NULL,NULL,51),(169,'2023-11-16 16:25:04',NULL,NULL,51),(170,'2023-11-16 16:25:04',NULL,NULL,51),(171,'2023-11-16 16:26:09',NULL,NULL,51),(172,'2023-11-16 16:26:09',NULL,NULL,51),(173,'2023-11-16 16:28:00',NULL,NULL,51),(174,'2023-11-16 16:29:03',NULL,NULL,137),(175,'2023-11-16 16:30:11',NULL,NULL,137),(176,'2023-11-16 16:33:53',NULL,NULL,138),(177,'2023-11-16 16:34:02',NULL,NULL,138),(178,'2023-11-16 16:34:17',NULL,NULL,138),(183,'2023-11-16 16:39:02',NULL,NULL,138),(185,'2023-11-16 16:39:41',NULL,NULL,138),(186,'2023-11-16 16:40:05',NULL,NULL,138),(187,'2023-11-16 16:41:12',NULL,NULL,138),(189,'2023-11-16 16:46:23',NULL,NULL,138),(190,'2023-11-16 16:47:24',NULL,NULL,138),(191,'2023-11-16 16:48:21',NULL,NULL,138),(192,'2023-11-16 16:48:54',NULL,NULL,138),(193,'2023-11-16 17:02:45',NULL,NULL,51),(194,'2023-11-16 17:02:45',NULL,NULL,51),(195,'2023-11-16 17:02:50',NULL,NULL,51),(196,'2023-11-16 17:02:50',NULL,NULL,51),(197,'2023-11-16 17:07:46',NULL,NULL,132),(198,'2023-11-16 17:07:53',NULL,NULL,132),(199,'2023-11-16 17:09:05','Ggb','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/199/merged_audio.mp3',132),(200,'2023-11-16 17:09:57',NULL,NULL,51),(201,'2023-11-16 17:17:59',NULL,NULL,51),(202,'2023-11-16 17:17:59',NULL,NULL,51),(203,'2023-11-16 17:18:15',NULL,NULL,51),(204,'2023-11-16 17:18:15',NULL,NULL,51),(205,'2023-11-16 17:18:27',NULL,NULL,51),(206,'2023-11-16 17:18:27',NULL,NULL,51),(207,'2023-11-16 17:19:09',NULL,NULL,51),(208,'2023-11-16 17:19:09',NULL,NULL,51),(209,'2023-11-16 17:20:53',NULL,NULL,51),(210,'2023-11-16 17:21:29',NULL,NULL,51),(211,'2023-11-16 17:21:40',NULL,NULL,51),(212,'2023-11-16 17:21:43',NULL,NULL,51),(213,'2023-11-16 17:21:43',NULL,NULL,51),(214,'2023-11-16 17:22:03',NULL,NULL,51),(215,'2023-11-16 17:22:13',NULL,NULL,51),(216,'2023-11-16 17:22:46',NULL,NULL,51),(217,'2023-11-16 17:23:00',NULL,NULL,51),(218,'2023-11-16 17:23:30',NULL,NULL,51),(219,'2023-11-16 17:23:38',NULL,NULL,51),(220,'2023-11-16 17:23:43',NULL,NULL,51),(221,'2023-11-16 17:29:57',NULL,NULL,137),(222,'2023-11-16 19:38:11',NULL,NULL,137),(223,'2023-11-16 19:39:04',NULL,NULL,137),(224,'2023-11-16 19:39:16',NULL,NULL,137),(225,'2023-11-16 19:39:33',NULL,NULL,137),(226,'2023-11-16 19:40:53',NULL,NULL,137),(227,'2023-11-16 19:41:30',NULL,NULL,137),(228,'2023-11-16 19:41:49',NULL,NULL,137),(229,'2023-11-16 19:41:53',NULL,NULL,137),(230,'2023-11-16 19:42:53',NULL,NULL,137),(231,'2023-11-16 19:44:26',NULL,NULL,137),(232,'2023-11-16 19:44:45',NULL,NULL,137),(233,'2023-11-16 19:46:53',NULL,NULL,132),(234,'2023-11-16 19:52:11',NULL,NULL,137),(235,'2023-11-16 19:52:33',NULL,NULL,137),(236,'2023-11-16 19:52:59','맥주한잔','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/236/merged_audio.mp3',137),(237,'2023-11-16 19:56:18',NULL,NULL,132),(238,'2023-11-16 19:56:43',NULL,NULL,132),(239,'2023-11-16 19:56:46',NULL,NULL,132),(240,'2023-11-16 19:56:55',NULL,NULL,132),(241,'2023-11-16 19:57:21',NULL,NULL,132),(242,'2023-11-16 19:57:30',NULL,NULL,132),(243,'2023-11-16 19:58:27',NULL,NULL,133),(244,'2023-11-16 19:58:28',NULL,NULL,132),(245,'2023-11-16 19:58:37',NULL,NULL,133),(246,'2023-11-16 19:58:38',NULL,NULL,133),(247,'2023-11-16 19:58:38',NULL,NULL,133),(248,'2023-11-16 19:58:39',NULL,NULL,133),(249,'2023-11-16 19:58:39',NULL,NULL,133),(250,'2023-11-16 19:58:40',NULL,NULL,133),(251,'2023-11-16 19:58:40',NULL,NULL,133),(252,'2023-11-16 19:58:41',NULL,NULL,133),(253,'2023-11-16 19:58:41',NULL,NULL,133),(254,'2023-11-16 19:59:01',NULL,NULL,132),(255,'2023-11-16 19:59:18',NULL,NULL,132),(256,'2023-11-16 19:59:29',NULL,NULL,132),(257,'2023-11-16 19:59:57',NULL,NULL,132),(258,'2023-11-16 20:00:08',NULL,NULL,132),(259,'2023-11-16 20:00:54',NULL,NULL,132),(260,'2023-11-16 20:01:30',NULL,NULL,132),(261,'2023-11-16 20:02:02',NULL,NULL,132),(262,'2023-11-16 20:06:25',NULL,NULL,140),(263,'2023-11-16 20:06:49',NULL,NULL,140),(264,'2023-11-16 20:21:21',NULL,NULL,132),(265,'2023-11-16 20:21:29',NULL,NULL,132),(266,'2023-11-16 20:21:45',NULL,NULL,140),(267,'2023-11-16 20:21:55',NULL,NULL,140),(268,'2023-11-16 20:22:24',NULL,NULL,140),(269,'2023-11-16 20:54:14',NULL,NULL,51),(270,'2023-11-16 20:54:41',NULL,NULL,137),(271,'2023-11-16 21:02:01','라면추천','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/271/merged_audio.mp3',137),(272,'2023-11-16 21:05:20',NULL,NULL,140),(273,'2023-11-16 21:31:30',NULL,NULL,140),(274,'2023-11-16 21:32:06',NULL,NULL,132),(275,'2023-11-17 08:31:01',NULL,NULL,140),(276,'2023-11-17 08:31:49','소고기','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/276/merged_audio.mp3',140),(277,'2023-11-17 08:33:05','사랑하는엄마','https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/277/merged_audio.mp3',140);
/*!40000 ALTER TABLE `produced_voice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploaded_video`
--

DROP TABLE IF EXISTS `uploaded_video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploaded_video` (
  `video_no` int NOT NULL AUTO_INCREMENT,
  `video_path` varchar(255) DEFAULT NULL,
  `model_no` int DEFAULT NULL,
  PRIMARY KEY (`video_no`),
  KEY `FK92hiq8atmlwh0h62sahdhi8uj` (`model_no`),
  CONSTRAINT `FK92hiq8atmlwh0h62sahdhi8uj` FOREIGN KEY (`model_no`) REFERENCES `model_board` (`model_no`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploaded_video`
--

LOCK TABLES `uploaded_video` WRITE;
/*!40000 ALTER TABLE `uploaded_video` DISABLE KEYS */;
INSERT INTO `uploaded_video` VALUES (2,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/51/234.mp4',51),(3,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/51/345.mp4',51),(7,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/77/234.mp4',77),(13,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/bk.mp4',132),(14,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/133/bk.mp4',133),(18,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/1.mp4',137),(19,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/3/138/1.mp4',138),(21,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/bk.mp4',140);
/*!40000 ALTER TABLE `uploaded_video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploaded_voice`
--

DROP TABLE IF EXISTS `uploaded_voice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploaded_voice` (
  `voice_no` int NOT NULL AUTO_INCREMENT,
  `voice_path` varchar(255) DEFAULT NULL,
  `model_no` int DEFAULT NULL,
  PRIMARY KEY (`voice_no`),
  KEY `FK91p4ydo4lysm7lpxvhcnh3ijd` (`model_no`),
  CONSTRAINT `FK91p4ydo4lysm7lpxvhcnh3ijd` FOREIGN KEY (`model_no`) REFERENCES `model_board` (`model_no`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploaded_voice`
--

LOCK TABLES `uploaded_voice` WRITE;
/*!40000 ALTER TABLE `uploaded_voice` DISABLE KEYS */;
INSERT INTO `uploaded_voice` VALUES (3,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/51/0fb5d946-58e4-4c48-9056-813d4e7b4c5b2.mp3',51),(4,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/51/0fb5d946-58e4-4c48-9056-813d4e7b4c5b1.mp3',51),(20,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/77/0fb5d946-58e4-4c48-9056-813d4e7b4c5b1.mp3',77),(43,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/m1.mp3',132),(44,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/m2.mp3',132),(45,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/m3.mp3',132),(46,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/m4.mp3',132),(47,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/132/m5.mp3',132),(48,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/133/m1.mp3',133),(49,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/133/m2.mp3',133),(50,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/133/m3.mp3',133),(51,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/133/m4.mp3',133),(52,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/133/m5.mp3',133),(68,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/minwoong1.mp3',137),(69,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/minwoong2.mp3',137),(70,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/minwoong3.mp3',137),(71,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/minwoong4.mp3',137),(72,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/137/minwoong5.mp3',137),(73,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/3/138/minwoong1.mp3',138),(74,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/3/138/minwoong2.mp3',138),(75,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/3/138/minwoong3.mp3',138),(76,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/3/138/minwoong4.mp3',138),(77,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/3/138/minwoong5.mp3',138),(83,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/m1.mp3',140),(84,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/m2.mp3',140),(85,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/m3.mp3',140),(86,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/m4.mp3',140),(87,'https://remeet.s3.ap-northeast-2.amazonaws.com/ASSET/4/140/m5.mp3',140);
/*!40000 ALTER TABLE `uploaded_voice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_no` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `is_admin` char(1) NOT NULL DEFAULT 'F',
  PRIMARY KEY (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'$2a$10$IOaYRziBcRukJNAsl26v8eaTAzD/C.bJek0a/c48Ez0genRSJP90O','https://remeet.s3.ap-northeast-2.amazonaws.com/PROFILE/5.jpg','osabero@naver.com','test1','김승우','F'),(2,'$2a$10$dd0pYwRNveEtYjUfsZI1N.9F3xkriA1nxIIj/bpBm4bIoWE5tOL1y','common','handsomeguy@email.com','handsomeguy','미남','T'),(3,'$2a$10$xoceyvCnM7Igo0TDzOR9ne905CDuQIy62D2PxRVE9mKnezmUTjNBS','common','kindcoach@email.com','kindcoach','친절코치','T'),(4,'$2a$10$vQpo4goLMNeLSQa/udmS2.YVSxsiPasavVrBVl/0uT9Hud8fR7J4a','https://remeet.s3.ap-northeast-2.amazonaws.com/PROFILE/3.jpg','remeet@email.com','admin','시연용','T'),(5,'$2a$10$.HQaf5AJQW1aWTTUBeNjuutxAzEY86KBSHvuH2qoFaaL.F0KCQXvu','common','abc123@naver.com','dla5324','임병국','F'),(6,'$2a$10$3V8SIlvzErqDEXNLoxhAbeHBNQnx489LagLYTXnVzUOVZji03mr3S','common','aa@dd.com','qudrnr','임병국','F'),(7,'$2a$10$Ncx0.sXKJ2zs9Vk47ZXPPO3n5M9HyL/EdsTYeARlg6OWLpaiz8BFS','common','42.4.woonchoi@gmail.com','Woonchoi','최웅렬','F');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-17  9:40:45

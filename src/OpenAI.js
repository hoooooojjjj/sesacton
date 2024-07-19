import React, { useState } from "react";
import axios from "axios";

const ChatComponent = () => {
  // 사용자가 업로드한 이미지 URL
  const [imageUrl, setImageUrl] = useState("");

  // 사용자가 입력한 메세지
  const [content, setContent] = useState("");

  // 대화 스레드 ID
  const [thread, setThread] = useState("");

  // OpenAI로부터 받은 답변
  const [response, setResponse] = useState("");

  // 대화 스레드 생성 시
  const handleCreateThread = async () => {
    try {
      // '/chat' 엔드포인트로 POST 요청(이미지 URL 전송 후 대화 스레드 생성)
      const response = await axios.post("http://localhost:8080/chat", {
        imageUrl,
      });
      // '/chat' 요청에서 응답으로 받은 thread id 값을 상태에 저장
      setThread(response.data.thread);
      // '/chat' 요청에서 받은 답변을 상태에 저장
      setResponse(response.data.response.answer);

      // 콘솔에 thread id 출력
      console.log("Thread created! Thread id :", response.data.thread);
      // 콘솔에 '/chat' 요청에서 받은 답변 출력
      console.log("first response : ", response.data.thread);
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 출력
      console.error("Failed to create thread : ", error);
    }
  };

  // 메세지 전송 시
  const handleSendMessage = async () => {
    // 스레드 id가 생성된 스레드와 일치하는지 확인 용 콘솔
    console.log("thread:", thread);

    // 스레드가 없을 경우 콘솔에 출력
    if (!thread) {
      console.log("No thread available. Create a thread first.");
      return null;
    }
    try {
      // '/chat/message' 엔드포인트로 POST 요청(이미지 URL, 메세지 내용, 스레드 id 전송 후 메세지 전송)
      const response = await axios.post("http://localhost:8080/chat/message", {
        imageUrl,
        content,
        threadID: thread,
      });
      // 콘솔에 '/chat/message' 요청에서 받은 답변 출력
      console.log(
        `sending response in ${thread} : `,
        response.data.response.answer
      );
      // '/chat/message' 요청에서 받은 답변을 상태에 저장
      setResponse(response.data.response.answer);
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 출력
      console.error("Failed to send response : ", error);
    }
  };

  return (
    <div>
      <h2>대화 시작하기</h2>
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button onClick={handleCreateThread}>시작</button>

      <h2>메세지 보내기</h2>
      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSendMessage}>보내기</button>

      <p>답변 : {response ? response : "잠시간 기다려주세요"}</p>
    </div>
  );
};

export default ChatComponent;

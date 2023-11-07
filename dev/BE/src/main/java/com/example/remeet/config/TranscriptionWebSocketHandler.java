package com.example.remeet.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
@Configuration
public class TranscriptionWebSocketHandler extends TextWebSocketHandler {

    private ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // 연결이 설정되면 세션을 저장합니다.
        sessions.put(session.getId(), session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        // 여기서는 클라이언트로부터 메시지를 받는 대신, 음성 데이터를 처리합니다.
        // 이 메소드는 예시로만 들어 있으며 실제 구현에서는 필요하지 않을 수 있습니다.
    }

    public void sendTranscriptionResult(String sessionId, String message) {
        // 이 메소드는 STT 결과를 클라이언트에게 전송하는 데 사용됩니다.
        WebSocketSession session = sessions.get(sessionId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                throw new RuntimeException("Error sending websocket message", e);
            }
        }
    }
}

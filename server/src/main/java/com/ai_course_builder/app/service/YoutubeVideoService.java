package com.ai_course_builder.app.service;

import com.ai_course_builder.app.document.YoutubeVideo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
public class YoutubeVideoService {

    @Value("${youtube.api-key}")
    private String apiKey;

    @Value("${youtube.base-url}")
    private String baseUrl;

    private final WebClient webClient;
    public YoutubeVideoService(WebClient.@NonNull Builder webClientBuilder){
        this.webClient = webClientBuilder.build();
    }
    public YoutubeVideo findYoutubeVideo(String searchQuery) {

        try {
            String url = UriComponentsBuilder
                    .fromUriString(baseUrl + "/search")
                    .queryParam("part", "snippet")
                    .queryParam("q", searchQuery)
                    .queryParam("type", "video")
                    .queryParam("videoEmbeddable", "true")
                    .queryParam("maxResults", "1")
                    .queryParam("key", apiKey)
                    .toUriString();

            Map response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            if(response == null) return null;

            List<Map> items = (List<Map>) response.get("items");
            if(items == null || items.isEmpty()) return null;
            Map item = items.get(0);
            Map id = (Map) item.get("id");
            Map snippet = (Map) item.get("snippet");
            String title = (String) snippet.get("title");
            String videoId = (String) id.get("videoId");
            String channelName = (String) snippet.get("channelTitle");

            YoutubeVideo youtubeVideo = new YoutubeVideo();
            youtubeVideo.setTitle(title);
            youtubeVideo.setVideoId(videoId);
            youtubeVideo.setChannelName(channelName);

            log.debug("Youtube video found for the query {} with videoId {}", searchQuery, videoId);
            return youtubeVideo;

        }
        catch(Exception e){
            log.warn("youtube service for the query {} with error {}", searchQuery, e.getMessage());
            return null;
        }
    }
}

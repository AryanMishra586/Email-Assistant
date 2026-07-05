package com.email.writer.app;

import org.springframework.stereotype.Service;

@Service
public class EmailGeneratorService {
    
    public String generateEmail(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);


        return "";

    }

    private String buildPrompt(EmailRequest emailRequest) {
        
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Please don't generate a subject line  ");

        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("The tone of the email should be: ").append(emailRequest.getTone()).append(". ");
        }

        prompt.append("\nEmail content: \n").append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}

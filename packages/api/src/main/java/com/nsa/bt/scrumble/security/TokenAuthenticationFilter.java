package com.nsa.bt.scrumble.security;

import com.nsa.bt.scrumble.models.User;
import com.nsa.bt.scrumble.services.IUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

// Adapted from https://github.com/callicoder/spring-boot-react-oauth2-social-login-demo/blob/master/spring-social/src/main/java/com/example/springsocial/security/TokenAuthenticationFilter.java
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(TokenAuthenticationFilter.class);
    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private IUserService userService;

    @Autowired
    private SecurityTracer securityTracer;

    @Bean
    public TokenUtils tokenUtils() {
        return new TokenUtils();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        var span = securityTracer.getTracer().buildSpan("Do Filter Internal").start();
        try {
            String jwt = tokenUtils.getJwtFromRequest(request, span);

            if (!tokenProvider.isValidToken(jwt, span)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid authentication.");
            }

            if (StringUtils.hasText(jwt)) {
                Long userId = tokenProvider.getUserIdFromToken(jwt, span);

                Optional<User> userOptional = userService.findUserById(userId.intValue(), span);

                if (userOptional.isPresent()) {
                    UserDetails userDetails = UserPrincipal.create(userOptional.get());
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception ex) {
            LOGGER.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
        span.finish();
    }
}

import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'
});

export const useSpotifyAPI = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('spotify_access_token') || '');
    const [expiresAt, setExpiresAt] = useState(localStorage.getItem('spotify_expires_at') || 0);
    const [currentTrack, setCurrentTrack] = useState({});

    //console.log(process.env.SERVER_URL);

    useEffect(() => {
        // Retrieve access token from local storage
        const token = localStorage.getItem('spotify_access_token');
        const expires = localStorage.getItem('spotify_expires_at');

        if (token && expires) {
            setAccessToken(token);
            setExpiresAt(parseInt(expires, 10));
        }

        const checkTokenExpiration = () => {
            const currentTime = Date.now() / 1000; // in seconds
    
            if (expiresAt && currentTime > expiresAt - 60) { // Refresh token 1 minute before it expires
                refreshToken();
            }
        };
    
        // Check token expiration every minute
        const interval = setInterval(checkTokenExpiration, 60000);
    
        return () => clearInterval(interval);
    }, [expiresAt]);

    const refreshToken = async () => {
        try {
            const response = await api.get('/api/spotify/refresh_token');
            const { access_token, expires_in } = response.data;

            setAccessToken(access_token);
            const newExpiresAt = (Date.now() / 1000) + expires_in;
            setExpiresAt(newExpiresAt);

            // Update local storage
            localStorage.setItem('spotify_access_token', access_token);
            localStorage.setItem('spotify_expires_at', newExpiresAt.toString());
            console.log('Token refreshed');
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }

    const getUserPlaylists = async () => {
        try {
            const response = await api.get('/api/spotify/playlists', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user\'s playlists:', error);
            return [];
        }
    };

    const getTopArtists = async () => {
        try {
            const response = await api.get('/api/spotify/top-artists', {
                headers: {
                'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching top artists:', error);
            return [];
        }
    };

    const getTopTracks = async () => {
        try {
            const response = await api.get('/api/spotify/top-tracks', {
                headers: {
                'Authorization': `Bearer ${accessToken}`
                }
            });
        return response.data;
        } catch (error) {
            console.error('Error fetching top tracks:', error);
            return [];
        }
    };

    return {
        currentTrack,
        getUserPlaylists,
        getTopArtists,
        getTopTracks
    };
};

import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: sessionStorage.getItem('token'),
        tokenID:null,
        tracks:null,
    }),
    actions: {
        clearToken() {
            this.token = null;
        },
        getToken() {
            return this.token;
        },
        setTokenID(tokenID) {
            this.tokenID = tokenID;
        },
        getTokenID() {
            return this.tokenID;
        },
        setTracks(tracks) {
            this.tracks = tracks;
        },
        getTracks() {
            return this.tracks;
        }
     
    },
})

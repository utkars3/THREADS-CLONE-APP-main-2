import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    proxy:{                       //get rid of CORS error
      "/api":{
        target:"http://localhost:5001",         //now while fetching we only have to write after this
        changeOrigin:true,
        secure:false,             //for http not https
      }
    }
  }
})

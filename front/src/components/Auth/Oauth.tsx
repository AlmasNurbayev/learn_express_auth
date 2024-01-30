import { googleLoginUrl, vkLoginUrl, yandexLoginUrl } from '../../config/config'
import './Oauth.css'

export default function Oauth() {
  return (
    <div className='oauth container'>
      <div>
        <a href={googleLoginUrl}>
        <img src="/googleLogo.png" className='oauth item'></img>
        </a>
      </div>
      <div>
        <a href={yandexLoginUrl}>
        <img src="/yandexLogo.png" className='oauth item'></img>
        </a>
      </div>
      <div>
        <a href={vkLoginUrl}>
        <img src="/vkLogo.png" className='oauth item'></img>
        </a>
      </div>


    </div>
  )
}

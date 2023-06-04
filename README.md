## 개발 환경 세팅

- 리액트 네이티브 공식 문서를 참고해서 개발 환경 세팅
- android/app/build.gradle의 ndkVersion과 일치하는 NDK를 안드로이드 스튜디오의 SDK Manager로 설치
- 프로젝트 생성

## 패키지 이름, 번들 아이디 변경

- react-native-rename

## 앱 이름 다국어 적용

- https://romeoh.tistory.com/445

## 빌드 환경 세팅

### 배경

- 패키지 이름 또는 번들 아이디가 같으면 디바이스, 파이어베이스 프로젝트, 플레이 스토어, 앱 스토어에서 같은 앱으로 인식

### 타입

- dev, alpha, beta, prod
- 빌드 타입마다 고유한 패키지 이름 또는 번들 아이디를 세팅

### 세팅

- android
    - 빌드 타입
    - 패키지 이름, 앱 이름
    - 환경 변수
        - react-native-config
    - 싸이닝
        - https://reactnative.dev/docs/signed-apk-android
        - 깃이그노어에 추가 후 구글 드라이브에 저장
    - 기타
        - def enableSeparateBuildPerCPUArchitecture = true
        - def enableProguardInReleaseBuilds = true
        - dev, alpha: android:usesCleartextTraffic="ture"
        - beta, prod: android:usesCleartextTraffic="false"
- ios
    - 빌드 타입
        - project > Info > Configurations
            - 플리퍼 비활성화
        - scheme
            - shared에 체크 후 리액트 네이티브 파일 생성 확인
        - Podfile 수정
    - 번들 아이디, 앱 이름
        - Target > Build Settings > Product Bundle Identifier 세팅 > Info.plist > bundle id
        - Target > Build Settings > Product Name 세팅 > Info.plist > bundle name
        - Target > Build Settings > Bundle Display Name 세팅 > Info.plist > bundle display name
    - 환경 변수
        - react-native-config
    - 싸이닝
        - certificate: 애플에서 개발자를 신뢰하기 위한 인증서
            - 키체인 접근을 통해 인증서 서명 요청을 발급받는다
            - 발급받은 인증서 서명 요청을 사용해서 애플 개발자 계정에서 개발용, 배포용 certificate(인증서)를 발급받는다
        - identifier: 디바이스에서 앱을 신뢰하기 위한 인증서
            - 애플 개발자 계정에서 앱의 아이디와 허용 기능을 정의한 identifier를 생성한다(4개)
            - identifier에서 사용할 기능들에 필요한 키를 생성한 후 다운로드 받아 구글 드라이브에 저장한다(4개)
        - 프로비저닝 프로필: 배포 방식 + certificate + identifier
            - dev profile: ios development + 개발용 certificate + dev identifier
            - alpha profile: ad hoc + 개발용 certificate + alpha identifier
            - beta profile: app store + 배포용 certificate + beta identifier
            - prod profile: app store + 배포용 certificate + prod identifier
        - xcode에서 로그인을 하고 target > signing에서 configurration에 team을 선택하면 자동으로 프로비저닝 프로필이 선택됨

## 업데이트 환경 세팅

- 버전 관리
    - android versionName 0.0.1로 세팅
    - ios > target > general > version(marketing_versioni) 0.0.1로 세팅
    - fastlane 설치
        - sudo gem install fastlane -NV
        - cd ios && sudo fastlane init
        - ios 폴더에 fastlane 설치를 위한 Gemfile이 생성되어 ios 폴더 내에서 bundle exec를 수행할 때 Gemfile의 path를 명시해야 함
    - 플러그인 추가 및 설치
        - cd ios && bundle exec --gemfile=./Gemfile fastlane install_plugins
    - Fastfile 작성
        - 패치 업데이트
            - android
                - versionName: package.json 버전
            - ios
                - CFBundleShortVersionString: package.json 버전
        - 마이너 업데이트
            - android
                - versionCode: 1 증가
                - versionName: package.json 버전
            - ios
                - CFBundleVersion: 1 증가
                - CFBundleShortVersionString: package.json 버전

- 업데이트 시나리오
    - 패치 업데이트
        - 상태: 현재 버전 0.1.3
        - 목표: 0.1.x 버전의 모든 앱을 0.1.4로 강제 업데이트
        - 0.0.x 버전의 앱은 코드푸쉬의 적용을 받지 않는다(앱 스토어 업데이트가 권장된다)
        - 0.1.x 버전 사용자는 코드푸쉬의 적용을 받는다(강제 업데이트)

    - 마이너 업데이트
        - 상태: 현재 버전 0.1.3
        - 목표: 0.2.0 버전으로 앱 업데이트를 권장
        - 0.1.x 버전 사용자는 앱 스토어 업데이트가 권장된다

## 빌드 타입에 따른 브랜치 관리 및 업데이트 전략

- dev
    - 시뮬레이터 또는 개인 디바이스로 앱 개발
    - 로컬 서버로 테스트
    - 내부 팀 테스트가 필요한 경우
        - 작업 중인 feat 브랜치에서 alpha 빌드 진행
        - apk, ipa 파일을 구글 드라이브로 공유해서 앱 테스트
        - 테스트 시 오류가 발생한 경우 코드 수정
        - 오류가 발생하지 않았을 경우 dev 브랜치에 머지
    - 업데이트가 필요한 경우
        - 패치 업데이트
            - fastlane 패치 업데이트 실행
            - beta 브랜치에 머지
        - 마이너 업데이트
            - fastlane 마이너 업데이트 실행
            - beta 브랜치에 머지
- beta
    - 패치 업데이트
        - 빌드 후 aab 파일 명령어로 코드푸쉬 서버에 업로드 (스테이징 코드푸쉬)
        - 테스트 서버로 테스트
        - prod 브랜치에 머지
    - 마이너 업데이트인 경우
        - 빌드
        - 플레이 스토어와 앱 스토어에 앱 등록
        - 내부 테스트 및 플라이트 테스트
        - 테스트 서버로 테스트
        - prod 브랜치에 머지
- prod
    - 패치 업데이트
        - 빌드 후 aab 파일 명령어로 코드푸쉬 서버에 업로드 (프로덕션 코드푸쉬)
    - 마이너 업데이트인 경우
        - 빌드
        - 플레이 스토어와 앱 스토어에 앱 등록 (즉시 배포)

## 패키지 설치

- @reduxjs/toolkit
- react-redux
- axios
- socket.io-client
- redux-saga
- lottie-react-native
- react-native-encrypted-storage
- react-native-status-bar-height
- react-native-keyboard-aware-scroll-view
- @react-native-picker/picker
- @react-navigation/native
    - react-native-screens react-native-safe-area-context
    - @react-navigation/native-stack
- @gorhom/bottom-sheet
    - react-native-reanimated react-native-gesture-handler
- react-native-permissions
- react-native-vector-icons
    - @types/react-native-vector-icons -D
- react-native-image-picker
- react-native-splash-screen
    - android
        - 공식 문서대로 세팅
        - android/app/src/main/res/drawable 폴더에 launch_screen.png 세팅
        - https://developer.android.com/develop/ui/views/launch/splash-screen
    - ios
        - 공식 문서대로 세팅
        - https://github.com/crazycodeboy/react-native-splash-screen/issues/606
        - xcode 스토리보드에 launch_screen.png 세팅
- @react-native-firebase/app
- @react-native-firebase/analytics
- @react-native-firebase/auth
    - dev, alpha, beta, prod 파이어베이스 프로젝트 생성
    - json 파일을 깃이그노어에 추가 후 파이어베이스 콘솔에 접근 권한을 가진 개발자 추가
    - android
        - dev, alpha: debug.keystore 파일로 sha1 생성 후 등록
        - beta, prod: release.keystore 파일로 sha1 생성 후 등록
        - dev, alpha, beta, prod google-services.json 파일을 다운받고 세팅
        - https://developers.google.com/android/guides/google-services-plugin#adding_the_json_file
        - 나머지는 공식 문서대로 진행
    - ios
        - dev, alpha, beta, prod GoogleService-Info.plist 파일을 다운받고 세팅
        - https://medium.com/atlas/using-multiple-firebase-environments-in-ios-12b204cfa6c0
        - https://firebase.google.com/docs/ios/installation-methods?hl=ko&authuser=0#cocoapods
        - 나머지는 공식 문서대로 진행
        ```
        GOOGLESERVICE_INFO_PLIST=GoogleService-Info.plist
          
        GOOGLESERVICE_INFO_DEVDEBUG=${PROJECT_DIR}/Firebase/DevDebug/${GOOGLESERVICE_INFO_PLIST}
        GOOGLESERVICE_INFO_ALPHADEBUG=${PROJECT_DIR}/Firebase/AlphaDebug/${GOOGLESERVICE_INFO_PLIST}
        GOOGLESERVICE_INFO_BETARELEASE=${PROJECT_DIR}/Firebase/BetaRelease/${GOOGLESERVICE_INFO_PLIST}
        GOOGLESERVICE_INFO_PRODRELEASE=${PROJECT_DIR}/Firebase/ProdRelease/${GOOGLESERVICE_INFO_PLIST}
          
        echo "Looking for ${GOOGLESERVICE_INFO_PLIST} in ${GOOGLESERVICE_INFO_DEVDEBUG}"
        if [ ! -f $GOOGLESERVICE_INFO_DEVDEBUG ] 
        then
            echo "No DevDebug GoogleService-Info.plist found. Please ensure it's in the proper directory."
            exit 1
        fi
          
        echo "Looking for ${GOOGLESERVICE_INFO_PLIST} in ${GOOGLESERVICE_INFO_ALPHADEBUG}"
        if [ ! -f $GOOGLESERVICE_INFO_ALPHADEBUG ] 
        then
            echo "No AlphaDebug GoogleService-Info.plist found. Please ensure it's in the proper directory."
            exit 1
        fi
          
        echo "Looking for ${GOOGLESERVICE_INFO_PLIST} in ${GOOGLESERVICE_INFO_BETARELEASE}"
        if [ ! -f $GOOGLESERVICE_INFO_BETARELEASE ] 
        then
            echo "No BetaRelease GoogleService-Info.plist found. Please ensure it's in the proper directory."
            exit 1
        fi
          
        echo "Looking for ${GOOGLESERVICE_INFO_PLIST} in ${GOOGLESERVICE_INFO_PRODRELEASE}"
        if [ ! -f $GOOGLESERVICE_INFO_PRODRELEASE ] 
        then
            echo "No ProdRelease GoogleService-Info.plist found. Please ensure it's in the proper directory."
            exit 1
        fi
          
        PLIST_DESTINATION=${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app
        echo "Will copy ${GOOGLESERVICE_INFO_PLIST} to final destination: ${PLIST_DESTINATION}"
          
        if [ "${CONFIGURATION}" == "DevDebug" ] 
        then
            echo "Using ${GOOGLESERVICE_INFO_DEVDEBUG}"
            cp "${GOOGLESERVICE_INFO_DEVDEBUG}" "${PLIST_DESTINATION}"
        elif [ "${CONFIGURATION}" == "AlphaDebug" ] 
        then
            echo "Using ${GOOGLESERVICE_INFO_ALPHADEBUG}"
            cp "${GOOGLESERVICE_INFO_ALPHADEBUG}" "${PLIST_DESTINATION}"
        elif [ "${CONFIGURATION}" == "BetaRelease" ] 
        then
            echo "Using ${GOOGLESERVICE_INFO_BETARELEASE}"
            cp "${GOOGLESERVICE_INFO_BETARELEASE}" "${PLIST_DESTINATION}"
        elif [ "${CONFIGURATION}" == "ProdRelease" ] 
        then
            echo "Using ${GOOGLESERVICE_INFO_PRODRELEASE}"
            cp "${GOOGLESERVICE_INFO_PRODRELEASE}" "${PLIST_DESTINATION}"
        fi
        ```
- @react-native-google-signin/google-signin
    - dev, alpha, beta, prod 파이어베이스 프로젝트에서 웹클라이언트아이디 가져와서 세팅
- @invertase/react-native-apple-authentication
    - xcode Capabilities에 애플 인증 추가
    - dev, alpha, beta, prod 프로비저닝 프로필 준비
    - xcode 로그인 후 팀 세팅

## 앱 아이콘 세팅

- 아이콘 크기 자동 세팅 싸이트 참고

## 브랜치 세팅

- dev > alpha
- dev > beta > prod

## 기타

- 리액트 네이티브 최신 아키텍쳐 활성화 X
- android kotlinVersion 변경 X

## 프로젝트 세팅

- git clone
- config
    - .env(빈 파일)
    - .env.dev .env.alpha .env.beta .env.prod(WEB_CLIENT_ID, API_URL, CS_URL)
- android
    - 안드로이드 스튜디오 Build Variants devDebug로 세팅
    - release.keystore
        - android/app에 세팅
    - appcenter-config.json
        - android/app/src/main/assets에 세팅
    - google-services.json
        - android/app/src/debug/alpha에 세팅
        - android/app/src/debug/dev에 세팅
        - android/app/src/release/beta에 세팅
        - android/app/src/release/prod에 세팅

- ios
    - xcode 로그인 후 팀 세팅
    - AppCenter-Config.plist
        - ios에 세팅
        - xcode에서 추가(레퍼런스로 인해서 자동으로 됨)
    - GoogleServices-Info.plist
        - ios/Firebase/DevDebug에 세팅
        - ios/Firebase/AlphaDebug에 세팅
        - ios/Firebase/BetaRelease에 세팅
        - ios/Firebase/ProdRelease에 세팅
        - xcode에서 Firebase 폴더 추가(자동으로 안됨, copy x, target 선택 x)

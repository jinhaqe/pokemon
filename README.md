# 포켓몬 도감

현재 공개되어있는 포켓몬 API를 사용해 포켓몬 도감을 제작하였습니다.

<br>

## 1. 개발 환경
   - React + Vite
   - Tailwind CSS

<br>

## 2. 현재 디렉토리
   ```
   src/
      ├── components/
      │   ├── AppProviders/       # 모든 Context API들을 묶어서 관리하는 컴포넌트
      │   ├── FormHeader/         # 로그인 및 회원가입 공통 헤더 UI
      │   ├── Header/             # 포켓몬 도감의 메인 헤더
      │   ├── Login/              # 로그인 폼
      │   ├── Signup/             # 회원가입 폼
      │   ├── Main/               # 포켓몬 리스트 및 검색 input이 포함된 메인 화면
      │   ├── PokemonCard/        # 포켓몬 이미지, 번호, 이름이 표시된 카드
      │   └── Modal/              # 포켓몬 상세정보를 보여주는 모달
      │
      ├── contexts/
      │   ├── LanguageContext.js      # 한영 변환 기능 제공
      │   ├── ModalContext.js         # 모달 열기/닫기 전역 상태 관리
      │   ├── PokemonContext.js       # 포켓몬 데이터 관리 및 검색/최적화 로직 포함
      │   ├── ThemeContext.js         # 다크모드/라이트모드 토글 기능
      │   └── TypeColorContext.js     # 타입별 이름(한/영)과 컬러 정보 제공
      │
      ├── App.js                  # 최상위 컴포넌트
      └── index.js               # 앱 진입점
   ```

   <br>

## 3. 주요 기능

   ### 1) 포켓몬 검색 기능
   - 포켓몬 이름(한글/영어)을 입력하면 해당 포켓몬만 필터링되어 리스트에 표시
   - PokemonContext 내부에서 검색 로직과 데이터 관리, 포켓몬의 번호로도 검색 가능
     
   <br>
    
   ### 2) 포켓몬 리스트 출력
   - Main 컴포넌트에서 전체 포켓몬 목록을 렌더링
   - 각각의 포켓몬은 PokemonCard를 통해 카드 형태로 보여짐
   - 카드에는 포켓몬의 이미지, 번호, 이름이 표시됨
  
   <br>
   
   ### 3) 포켓몬 상세 정보 모달
   - PokemonCard 클릭 시 ModalContext를 통해 모달 오픈
   - Modal 컴포넌트에서 선택된 포켓몬의 상세 정보를 확인 가능
   - 타입, 능력치, 설명 등 추가 정보가 포함되어 있음

   <br>
  
   ### 4) 다국어 지원 (한/영 변환)
   - LanguageContext를 통해 언어를 한글 ↔ 영어로 전환 가능
   - 포켓몬 이름, 타입명 등의 표기가 실시간으로 변경됨

   <br>

   ### 5) 다크모드 / 라이트모드
   - ThemeContext를 통해 UI 테마 전환 가능
   - 사용자 설정에 따라 시각적 경험을 바꿀 수 있음

   <br>

   ### 6) 포켓몬 타입 색상 및 정보 제공
   - TypeColorContext에서 포켓몬 타입에 따른 컬러값과 타입명(한/영)을 관리
   - 카드나 상세 정보 UI에 시각적으로 일관성 있게 적용됨

   <br>
  
## 3. 결과 화면

<br>

   ![라이트 모드 메인](https://github.com/user-attachments/assets/3dc87227-7c2d-423c-8396-05d060eccb98)


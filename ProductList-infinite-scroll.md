### `ProductList` 무한 스크롤 로직 정리

#### 1. 전체 개요

`ProductList` 컴포넌트는 **IntersectionObserver + 페이지네이션 API(`getMoreProducts`)**를 이용해서,
리스트 맨 아래에 있는 `span`이 화면에 들어올 때마다 다음 페이지 데이터를 불러와서 이어 붙이는 방식으로
무한 스크롤(또는 “더 보기” 자동 로딩)을 구현하고 있습니다.

---

#### 2. 상태(state)들

```tsx
const [products, setProducts] = useState(initialProducts);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [isLastPage, setIsLastPage] = useState<boolean>(false);
const [page, setPage] = useState<number>(1);
const trigger = useRef<HTMLSpanElement>(null);
```

- **`products`**: 화면에 보여줄 상품 목록
  - 처음에는 서버에서 받은 `initialProducts`로 시작
  - 추가 로딩하면 `setProducts(prev => [...prev, ...newProducts])`로 뒤에 붙임
- **`isLoading`**: 현재 추가 데이터를 불러오는 중인지 여부
  - 로딩 중에는 버튼 텍스트를 `"ロード中"` 로 보여줌
- **`isLastPage`**: 더 이상 불러올 페이지가 없는지 여부
  - 마지막 페이지면 `"最後のページです"` 문구를 보여주고 트리거를 렌더링하지 않음
- **`page`**: 현재 몇 페이지까지 불러왔는지
  - 초기값 `1`에서 시작, 새로 불러오면 `setPage(prev => prev + 1)`
- **`trigger` (ref)**:
  - 하단 `span`에 연결되는 DOM 참조
  - IntersectionObserver가 “이 요소가 화면에 들어왔는지”를 감시하는 대상

---

#### 3. IntersectionObserver 설정

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    async (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      const element = entries[0];
      if (element.isIntersecting && trigger.current) {
        observer.unobserve(trigger.current);
        setIsLoading(true);
        const newProducts = await getMoreProducts(page + 1);
        if (newProducts.length !== 0) {
          setPage(prev => prev + 1);
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setIsLastPage(true);
        }
        setIsLoading(false);
      }
    },
    {
      threshold: 1.0,
    }
  );
  if (trigger.current) {
    observer.observe(trigger.current);
  }
  return () => {
    observer.disconnect();
  };
}, [page]);
```

##### 3-1. 언제 `useEffect`가 실행되는가?

- 의존성 배열이 `[page]` 이므로:
  - **마운트 시 1번 실행**
  - **`page` 값이 바뀔 때마다 다시 실행**
- 즉, **새 페이지를 성공적으로 불러와서 `setPage`가 호출된 다음**에,
  새로 바뀐 `page` 값 기준으로 다시 옵저버를 붙이는 구조입니다.

##### 3-2. IntersectionObserver 콜백의 역할

```tsx
async (entries, observer) => {
  const element = entries[0];
  if (element.isIntersecting && trigger.current) {
    observer.unobserve(trigger.current);
    setIsLoading(true);
    const newProducts = await getMoreProducts(page + 1);
    ...
  }
}
```

- **`entries[0]`**: 감시 대상(여기서는 `trigger.current`)에 대한 관찰 결과
- **`element.isIntersecting`**:
  - 이 값이 `true`이면, 요소가 뷰포트 안(또는 threshold 조건)을 만족했다는 뜻
- 조건: `element.isIntersecting && trigger.current`
  - 트리거 요소가 화면에 들어왔고, 실제 DOM도 존재하면 다음 로직 실행

##### 3-3. 한 번 트리거되면 일단 `unobserve`

```tsx
observer.unobserve(trigger.current);
```

- 현재 `trigger` 요소의 관찰을 일단 중단
- 이유:
  - 데이터 로딩 중에 스크롤이 살짝만 움직여도 계속 콜백이 여러 번 불릴 수 있음
  - 그걸 방지하기 위해 **한 번 발동하면 관찰을 멈추고**,
    데이터 로딩이 끝난 뒤에, `page`가 바뀌면서 `useEffect`가 다시 돌고 새로 `observe` 하게 만듦

##### 3-4. 다음 페이지 데이터 로딩

```tsx
setIsLoading(true);
const newProducts = await getMoreProducts(page + 1);
```

- **`getMoreProducts(page + 1)`**:
  - 현재 `page`의 **다음 페이지**를 요청
  - 예를 들어:
    - 현재 `page = 1`이면 `2`페이지 요청
    - `page`는 아직 올리지 않고, 요청이 성공했을 때만 올림

##### 3-5. 응답에 따라 분기

```tsx
if (newProducts.length !== 0) {
  setPage(prev => prev + 1);
  setProducts(prev => [...prev, ...newProducts]);
} else {
  setIsLastPage(true);
}
setIsLoading(false);
```

- **새 데이터가 있는 경우 (`length !== 0`)**
  - `setPage(prev => prev + 1);`
    - 현재 페이지를 +1 (예: 1 → 2)
    - 이로 인해 `useEffect`가 다시 실행되고,
      새롭게 렌더된 `trigger` 요소에 대해 `observer.observe(...)` 재설정
  - `setProducts(prev => [...prev, ...newProducts]);`
    - 기존 상품 배열 뒤에 새 배열을 이어 붙임 (무한 스크롤 효과)
- **새 데이터가 없는 경우 (`length === 0`)**
  - `setIsLastPage(true);`
  - 이후 렌더에서 `isLastPage`가 `true`가 되므로,
    트리거 요소 대신 `"最後のページです"` 문구를 렌더
- 마지막으로 `setIsLoading(false);`로 로딩 상태 해제

---

#### 4. 렌더링 구조 (UI 레벨)

```tsx
return (
  <div className="p-5 flex flex-col gap-5">
    {products.map(product => (
      <ListProduct key={product.id} {...product} />
    ))}
    {isLastPage ? (
      <div className="text-center text-sm text-neutral-500">
        最後のページです
      </div>
    ) : (
      <span
        ref={trigger}
        className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
      >
        {isLoading ? 'ロード中' : 'もっと見る'}
      </span>
    )}
  </div>
);
```

- **상품 리스트**
  - `products.map(...)`로 현재까지 불러온 모든 상품을 렌더
- **마지막 부분: `isLastPage`에 따라 분기**
  - `isLastPage === true`:
    - `最後のページです` 텍스트만 보여주고, `trigger` 요소를 렌더하지 않음 → 더 이상 로딩 없음
  - `isLastPage === false`:
    - `span`이 렌더되고, 여기에 `ref={trigger}`가 걸림
    - 이 `span`이 화면에 보이는 순간 IntersectionObserver 콜백이 불림
    - 텍스트:
      - `isLoading === true`: `"ロード中"` (로딩 중 표시)
      - `isLoading === false`: `"もっと見る"` (더 보기 느낌)

즉, **이 `span`이 무한 스크롤의 “센서” 역할**을 합니다.

---

#### 5. 전체 흐름 요약

1. **최초 렌더**: 1페이지(`initialProducts`) 렌더 + 트리거 `span` 렌더
2. **트리거 `span`이 화면에 들어옴** → IntersectionObserver 콜백 호출
3. `getMoreProducts(page + 1)` 호출 → 새 데이터 응답
4. 데이터가 있으면:
   - `page` +1
   - `products`에 새 아이템 추가
   - effect 재실행 → 새 `span`에 대해 다시 observe
5. 데이터가 없으면:
   - `isLastPage = true`
   - 더 이상 `span` 렌더 안 함 → 콜백도 안 불림 → 무한 스크롤 종료

---

#### 6. 개선 아이디어 (참고)

- **중복 로딩 방지**
  - 콜백 안에서 `if (isLoading) return;` 같은 early return을 넣어 이중 호출 방지 가능
- **에러 처리**
  - `try/catch`로 `getMoreProducts` 에러를 잡고, 에러 메시지 상태를 추가해 사용자에게 표시
- **재사용성 향상**
  - 이 로직을 커스텀 훅(`useInfiniteScroll`)으로 분리해 다른 리스트에도 재사용 가능

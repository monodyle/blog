---
title: TypeScript - Type level Functional Programming
excerpt: Dạo này mình khám phá ra một vũ trụ mới khi dẩy đầm với typescript
date: May 24, 2023
image: /assets/blog/typescript-functional-programming/featured.png
tags: [typescript]
---

Sau một quãng thời gian ăn dằm nằm dề và hốt bao nhiêu sh*t do chính mình tạo ra, mình đã dần ngộ ra thế giới **TypeScript** (Xin phép viết tắt TS) kỳ diệu biết bao. Cũng nhờ vậy, mình nhận ra rằng, nếu giờ bắt đầu một dự án mới mà không có TS, mình cũng không biết phải bắt đầu từ đâu và rồi mình sẽ phải code như thế nào. Có vẻ như TS đã trở thành một phần không thể thiếu khi bắt đầu những dự án mới.

## TypeScript, từ cơ bản tới qua cơ bản

Để mà nói, thật ra dùng TS cũng có rất nhiều cách, đôi khi chỉ cần biết khai báo kiểu dữ liệu cho một biến, một hàm hoặc một object nhất định là cũng đủ dùng rồi.

Thật ra hồi đầu định viết một bài giới thiệu cơ bản TypeScript, cơ mà mấy bài đó trên google thiếu gì, thậm chí bạn nào học thuộc được cái handbook[^1] của TypeScript khéo còn đấm vỡ mồm mình. Thế là mình quyết định viết một bài chảnh ~~chó~~ hơn tý, dùng TypeScript làm functional programming language xem cộng đồng có lác mắt không. Mà chắc là không rồi vì mình cũng vừa mới ra khỏi vũng lầy của static typing không lâu :nosebleed:

[^1]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

## Chơi với TypeScript

### Nghịch

Hồi đầu năm, mình rảnh háng không có gì làm nên ngồi nghịch cái [octokit] của Github. Thấy s*ao cái typing của nó xịn quá*, viết gì cũng hiểu :adore: Kiểu như này:

[octokit]: https://github.com/octokit/octokit.js

```ts
octokit.request('GET /repos/{owner}/{repo}', {
  owner: 'monodyle',
  repo: 'blog'
})
```

Các bạn có thể thấy, hàm `request` nhận vào 2 arguments, 1 là **template** (trong docs của Github thì gọi là *summary representation*) thông tin một cái HTTP request `GET /repos/{owner}/{repo}`, 2 là các **params** để replace vào cái template.

Thông thường, mình (*của quá khứ*) và các bạn (*hoặc không*) sẽ viết typing cho cái hàm đó như thế này: `request(route: string, parameters: Record<string, string>)`.

Đúng vậy, làm sao có thể sai được? :doubt: Ừ thì không sai, nhưng khi editor hoặc IDE của bạn có cài intelephense[^intelephense] hoặc plugin gì đó hỗ trợ type doc, thì bạn sẽ bất ngờ ở 2 vấn đề:

[^intelephense]: Intelephense is a high performance, cross platform PHP language server adhering to the Language Server Protocol (LSP). (https://intelephense.com/)

1. Argument thứ nhất `route` có thể suggest toàn bộ HTTP request của Github API. Ok, cái này đơn giản, mình cũng có thể làm được. Sử dụng union[^2] một đống endpoint đã define sẵn có thể giải quyết việc này:
```ts {1-6,9}
type Route =
  | 'GET /orgs/{org}/repos'
  | 'POST /orgs/{org}/repos'
  | 'GET /repos/{owner}/{repo}'
  | 'PATCH /repos/{owner}/{repo}'
  | ...

function request(
  route: Route,
  parameters: Record<string, string>
) {
  // ...
}
```
Bây giờ khi gõ `request(`, ở cursor của bạn sẽ tự suggest những route đã được define từ trước.

[^2]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types

2. Đúng vậy, đơn giản chỉ là điền vào một object để replace từng param trong template thì mình dã không nhọc công tìm hiểu. Cái bá đạo ở đây là khi mình viết bất cứ cái route là gì thì cái arg params thứ hai cũng có thể infer ra chính xác type gồm những field nào cần phải điền vào.

Ví dụ, khi mình viết `GET /repos/{owner}/{repo}`, mà arg thứ 2 mình để trống, thì typescript sẽ chửi mình luôn. Type chính xác cần phải điền vào là `{ owner: string; repo: string }`, tức là nếu mình viết thế này: `request('GET /repos/{owner}/{repo}', { owner: 'monodyle' })` thì xác suất bị chửi là 100% vì arg thứ 2 thiếu field `repo`.

*But... how?*

Ban đầu, mình nghĩ có thể dùng overload[^3] để phục vụ việc khai báo:
[^3]: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads

```ts
function request(route: 'GET /orgs/{org}/repos', parameters: { org: string }): void;
function request(route: 'GET /repos/{owner}/{repo}', parameters: { owner: string, repo: string }): void;
function request(route: string, parameters: Record<string, string>): void {
  // ...
}
```

Nhưng thực sự cách này không hay lắm vì có nhiều điểm hạn chế:
1. **Số lượng overload quá lớn**, dần dần có thể dẫn tới một lượng cực lớn code bị phình ra trong code base
2. Tuy khi kill params sai hoặc thiếu thì TypeSript sẽ không lỗi, tuy nhiên **intelephense sẽ không suggest chính xác** những params nào cần fill cho một endpoint cụ thể mà sẽ union toàn bộ type rồi suggest, ví dụ với `route` là `GET /orgs/{org}/repos`, rõ ràng mình chỉ cần fill `org` nhưng intelephense sẽ suggest cả những key khác như `owner`

Mò mẫm mãi, mình tìm ra được một package `@octokit/types` khá thú vị ở repo [octokit/types.ts]. Hoá ra, file type được generated từ một file JSON lấy từ GraphQL của Github.

[octokit/types.ts]: https://github.com/octokit/types.ts

Thật ra mình cũng không bất ngờ lắm, vì đây là cách làm khá phổ biến ở nhiều công ty lớn có lượng endpoint API khoảng vài trăm tới vài nghìn, không ai rảnh để đi define hết toàn bộ endpoint. Thông thường, mình biết một vài công ty sẽ dùng OpenAPI Swagger[^4] để backend define REST endpoint, sau đó frontend có thể dùng file JSON swagger để auto-gen type.

[^4]: https://swagger.io/

### Múa

Mình biết tới octokit một phần nhỏ là công của [Thiện Đỗ][thiendo] giới thiệu cho mình. Sau đó mấy buổi, mình có đi cafe với mấy anh em ở công ty cũ, rồi tranh thủ ngồi giải quyết cái vấn nạn về typing cho endpoint bao lâu nay mình gặp phải. Từ trước đó rất lâu, mình đã đặt ra bài toán này rồi, chẳng qua hồi đó trình độ cùn và code xấu, nên lúc thấy cái typing của octokit, mình như được khai sáng.

[thiendo]: https://github.com/thien-do/

![Chat](/assets/blog/typescript-functional-programming/chat.png)

Trong source của [octokit/types.ts] có mấy type khá hay:

```ts
// https://github.com/octokit/types.ts/blob/c1af6e0f3ec7be86e0befc45e966a1798a9497f1/src/generated/Endpoints.ts#L14-L63
type ExtractParameters<T> = "parameters" extends keyof T
  ? UnionToIntersection<
      {
        [K in keyof T["parameters"]]: T["parameters"][K];
      }[keyof T["parameters"]]
    >
  : {};
type ExtractRequestBody<T> = "requestBody" extends keyof T
  ? "content" extends keyof T["requestBody"]
    ? "application/json" extends keyof T["requestBody"]["content"]
      ? T["requestBody"]["content"]["application/json"]
      : {
          data: {
            [K in keyof T["requestBody"]["content"]]: T["requestBody"]["content"][K];
          }[keyof T["requestBody"]["content"]];
        }
    : "application/json" extends keyof T["requestBody"]
    ? T["requestBody"]["application/json"]
    : {
        data: {
          [K in keyof T["requestBody"]]: T["requestBody"][K];
        }[keyof T["requestBody"]];
      }
  : {};
type ToOctokitParameters<T> = ExtractParameters<T> &
  ExtractRequestBody<Required<T>>;

type Operation<
  Url extends keyof paths,
  Method extends keyof paths[Url],
  preview = unknown
> = {
  parameters: ToOctokitParameters<paths[Url][Method]> &
    RequiredPreview<preview>;
  request: {
    method: Method extends keyof MethodsMap ? MethodsMap[Method] : never;
    url: Url;
    headers: RequestHeaders;
    request: RequestRequestOptions;
  };
  response: ExtractOctokitResponse<paths[Url][Method]>;
};
```

Cụ thể, đoạn này nó tự split endpoint ra, sau đó tự infer ra type cho payload. Nhìn thì tương đối phức tạp, hồi trước mình ngồi đọc mãi cũng hiểu được đại khái, giờ đọc lại cũng giống như nước đổ đầu vịt.

Vì phần này viết có spec khá nặng cho Github Rest API, và nó được **auto-gen từ một cái auto-gen** khác. Nên mình sẽ chút lai mấy cái tinh hoa mà mình học được để mọi người cùng tham khảo.

Sau khi kế thừa cái kiến thức type vĩ mô của octokit, mình có dùng type để thực tập một vài cái khá đơn giản, như routing của web app. Thông thường một app với số lượng page nhiều lên, mọi người có xu hướng sẽ gom thông tin routing lại một chỗ để quản lý cho dễ.

Ví dụ như một project *Next.js* của mình đôi khi sẽ gom hết thông tin cho routing vào một file `consts/routing.ts`:

```ts
const routing = {
  home: {
    title: 'Home',
    route: '/'
  },
  blog: {
    title: 'Blog',
    route: '/blog',
  },
  post: {
    title: 'Post',
    route: '/blog/[slug]',
  },
} as const

export default routing
```

Nhưng việc tái sử dụng lại khá phức tạp. Mỗi lần cần viết navigate, mình phải replace cái `[slug]` trong dynamic route `/blog/[slug]` thành cái slug tương ứng, vậy là phải làm như thế này:

```ts {9}
import routing from '#/consts/routing.ts'

function Foo({ slug }) {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    router.push(
      routing.post.route.replace('[slug]', slug)
    )
  }

  // ...
}
```

Dẫn đến việc, đôi khi mình không kiểm soát được việc liệu template url có được replace hay chưa, và replace có đúng chỗ hay không? :stab:

Thế nên mình viết một cái util để làm việc kiểm soát routing cho mình, type level trông sẽ như thế này:

```ts {15}
type Route =
  | '/'
  | '/blog'
  | '/blog/[slug]'

type ParseRouteString<Router> = Router extends `${infer Start}/${infer Rest}`
  ? ParseRouteString<Start> & ParseRouteString<Rest>
  : Router extends `[${infer Param}]`
    ? { [K in Param]: string }
    : {}

type GetRouteParams<Router extends Route> = ParseRouteString<Router>

type Params = GetRouteParams<'/blog/[slug]'>
//   ^? type Params = { slug: string; }
```

Để giải thích đơn giản, thì hàm `ParseRouteString` có nhiệm vụ bóc tách raw string ra những phần khác nhau:
1. Bắt đầu bằng việc bóc tách trước và sau dấu slash (`/`), nếu vẫn còn dấu slash thì sẽ đệ quy tiếp, join hai cái lại với nhau
2. Khi trong các thành phần trước hoặc sau không còn dấu slash, kiểm tra xem thành phần có dynamic param (được định nghĩa bằng một string ở giữa và hai dấu ngoặc vuông ở đầu, ví dụ: `[slug]`, `[id]`)
3. Nếu có, thì param sẽ tạo ra một object type `{ ten_param: string }`. Nếu không thì trả về object type rỗng `{}`

Nó có thể hoạt động với những nested router phức tạp hơn như sau:

```ts
type Params = ParseRouteString<'/repos/[owner]/[repo]/issues/[issue_number]'>
//   ^? { owner: string; } & { repo: string; } & { issue_number: string; }
```

Và tuỳ vào khả năng thiên biến vạn hoá, chúng ta có thể thêm cả typing vào cho từng param:

```ts {4,5,10,11}
type ParseRouteString<Router> = Router extends `${infer Start}/${infer Rest}`
  ? ParseRouteString<Start> & ParseRouteString<Rest>
  : Router extends `[${infer Param}]`
    ? Param extends `${infer Name}:${infer Type}`
      ? { [K in Name]: Type extends 'number' ? number : string }
      : { [K in Param]: string }
    : {}

type Params = ParseRouteString<'/repos/[owner]/[repo]/issues/[issue_number:number]'>
//   ^? { owner: string; } & { repo: string; } & { issue_number: number; }
//                                                  ^ bây giờ cái này là number
```

Sau khi viết type level xong, chúng ta có thể viết utils ở runtime với type như thế này:

```ts
export const route = <R extends Route>(route: R, params?: GetRouteParams<R>): string => {
  let url = String(route)
  if (params && Object.keys(params).length > 0) {
    url = Object.entries<string>(params).reduce<string>(
      (path, [key, value]) => path.replace(`[${key}]`, value),
      route
    )
  }
  url = url.replace(/(\(|\)|\/?\[[^\/]+\])/g, '') // clean up
  return url
}
```

## Functional

Thật ra chém gió là chính, trên thực tế việc viết functional programming trong TS khá hardcore, hơn mình tưởng tượng nhiều. Vì mình cũng chưa hiểu hết cách TypeScript hoạt động. Đôi khi mình mong muốn type trả về là một union của một enum, nhưng nó lại trả về union của literal value, thì hai type này cũng có thể mâu thuẫn với nhau.

Tuy nhiên mình vẫn đang cố học cách viết functional ở type-level, vì nó là thứ thiết yếu nếu muốn viết một thư viện xịn và mạnh.

Một vài ví dụ khá vui khi mình nghịch TypeScript:

**Lấy độ dài của một array:**
```ts {11}
type Arr = (readonly any[]) | any[]
type Length<A extends Arr> = A["length"] & number

const posts = [
  { title: 'TypeScript 101' },
  { title: 'JavaScript is a mistake' },
  { title: 'TypeScript sucks, amma gettin back JavaScript' }
] as const

type NumberOfPost = Length<typeof posts>
//   ^? type NumberOfPost = 3
```

**Phép cộng trừ:**
```ts {19,21}
type Push<A extends Arr, Val> = [...A, Val]
type Counter<Len extends number, A extends Arr = []> = T["length"] extends Len
  ? A
  : Counter<Len, Push<A, any>>

export type Add<X extends number, Y extends number> = Length<
  [...Counter<X>, ...Counter<Y>]
>

export type Subtract<X extends number, Y extends number> = Counter<X> extends [
  ...infer U,
  ...Counter<Y>
]
  ? Length<U>
  : never

// Example
type AddExample = Add<8, 3>
//   ^? type AddExample = 11
type SubtractExample = Subtract<10, 5>
//   ^? type SubtractExample = 5
```

## Tổng kết

TypeScript không chỉ đơn giản là thêm typing cho JavaScript, mà bản thân nó còn có thể tự trở thành một programming language (cho type level). Tuy nhiên, vì một vài lý do, việc viết TypeScript phức tạp và nhiều có thể gây đến một số vấn đề về hiệu năng trong quá trình code. Bạn có thể thử chạy ví dụ phép cộng ở trên với hai con số lớn hơn, sẽ thấy thời gian cho kết quả chậm hơn rõ ràng.

Vì vậy vẫn nên hạn chế sử dụng chúng nếu không cần thiết nhé. Như một người anh ở [Ehkoo] đã từng nói:

![Ehkoo TS Sucks](/assets/blog/typescript-functional-programming/ts-sucks.png)

[Ehkoo]: https://ehkoo.com/

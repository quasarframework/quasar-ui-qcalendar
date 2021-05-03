---
title: Write your first QCalendar article
desc: How to write your first QCalendar article
author: Jeff Galbraith
keys: latest-news
components:
  - articles/ArticlesAvatar
---

![image](/articles/2021-05-01_writing-your-first-article/index.jpg =1200x200)

## Writing your first QCalendar article

<articles-avatar
  avatar-src="https://avatars.githubusercontent.com/u/10262924"
  author-name="Jeff Galbraith"
  published-date="2021-05-01"
/>

News and Articles, like much of the content on this site, is driven by markdown. If you would like to add to the content here, by adding some news or an article, the following steps will help get you started.

You will need to create a PR (Pull Request) to have your content added to the main repo. Creating a PR is beyond the scope of this article, but a quick search should find you plenty of information.

1. In `src/pages/articles` add a file for your content (**this needs to be all lowercase**)
    - the file's first 10 characters are in ISO date format (**YYYY-MM-DD**); this represents when the article will be published and the order it will appear in. If right away, then just use today's date.
    - The next character is an underscore ( **_** ), which is used to split the date from the file name. DO NOT use an underscore anywhere else in this file name.
    - The rest of the file name becomes your title. Keep it all in lowercase and replace any whitespace characters with a dash ( **-** ), in other words, **keep it kebab-case** and don't use emojies.
    - Finally, the extension must be `.md` or it will not be processed.
2. If you have any images associated with your artical, they need to be placed into `public/articles/...` where `...` matches the filename of your markdown file (without the extension).
3. Put your cover image in the folder specified in step #2 and name it `index.jpg`. All other images used in your article go in this folder and can be jpg or png format, and you use normal markdown notation to reference them. The cover image should be wider than it is tall to look better in the Article Grid. 4/3 aspect ratio will look the best.

The remainer of this article will let you know how to deal with specifics, including adding a component to your article.

### Yaml

The top of a markdown file is in Yaml format.

```yaml
---
title: Write your first QCalendar article
desc: How to write your first QCalendar article
author: Jeff Galbraith
keys: latest-news
---
```

If you do write a component to go along with your article, then it should be placed into the `components/page-parts/articles` folder.

To reference it, we add to the yaml:

```yaml
components:
  - articles/MyComponentFileName
```

Other things you can do in the yaml is reference other markdown pages on this site:

```yaml
related:
  - /developing/timestamp/getting-started
  - /latest-news/articles/2021-05-01_my-other-article
```
### Components
You can write your own components and use them in your article.

For instance, I started writing this article and I wanted an avatar and a date when the article was published. I added code that looked like this:

```html
<div class="row items-center" style="margin-top: -20px;">
  <q-avatar size="24px">
    <img src="https://avatars.githubusercontent.com/u/10262924">
  </q-avatar>
  <p class="q-ml-sm">Jeff Galbraith / 2021-05-01</p>
</div>
```

But then I thought, instead of everyone that writes an article duplicating the same code (and to keep a consistent look and feel), I'd just put it into a component, reference it in my yaml and then use it.

The yaml part of this article now has:

```yaml
components:
  - articles/ArticlesAvatar
```

and I can use the component like this, directly in the markdown:

```html
<articles-avatar
  avatar-src="https://avatars.githubusercontent.com/u/10262924"
  author-name="Jeff Galbraith"
  published-date="2021-05-01"
/>
```

And what you get is my avatar that you see at the top of the page.

But, say this was a tutorial, you could write a component that references one of the QCalendar calendar components. The only rule to be followed is that the component **must** be in the `components/page-parts/articles` folder.

### Images

Just a little about using images on this site. It uses a superset of the GitHub markdown for images. In our markdown, you can specify a hover title and also width and height

Here is what that would look like in markdown:

```md
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat" =300x300)
```

And, this is what the user sees.

![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat" =300x300)

The images are also responsive so scale smaller for smaller devices, like mobile.

I hope what's been written here can help you. If you see any issues, grammar or spelling errors, click the link below to **Edit this page on GitHub**.
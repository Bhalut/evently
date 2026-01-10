# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Create Account" [level=1] [ref=e5]
      - paragraph [ref=e6]: Join Evently to manage your events
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: Full Name
        - textbox "Full Name" [ref=e10]:
          - /placeholder: John Doe
        - generic [ref=e11]: Name must be at least 2 characters
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox "Email" [ref=e14]:
          - /placeholder: name@example.com
          - text: login-1768059250986@example.com
      - generic [ref=e15]:
        - generic [ref=e16]: Password
        - textbox "Password" [ref=e17]:
          - /placeholder: ••••••••
          - text: password123
      - button "Sign Up" [active] [ref=e18] [cursor=pointer]
    - generic [ref=e19]:
      - text: Already have an account?
      - link "Sign in" [ref=e20] [cursor=pointer]:
        - /url: /login
  - button "Open Next.js Dev Tools" [ref=e26] [cursor=pointer]:
    - img [ref=e27]
  - alert [ref=e30]
```
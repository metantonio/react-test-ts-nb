This will be a Higher-Order Component (HOC) to wrap the authentication logic in front-end.

The idea is that components or views that must be protected, import the withAuth function to wrapper it self.

something like this for a theorical Profile Component:

```
import WithAuth from "../component/Auth/withAuth";

const Profile = () => {
 // ...
}

export default WithAuth(Profile);
```

more questions about this HOC, mail me to: 
antonio.martinez@qlx.com
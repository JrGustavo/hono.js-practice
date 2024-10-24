import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import type { FC } from "hono/jsx";




const usersRouter = new Hono()

type User = {
    id: number;
    name: string;
};

const Layout: FC = ({ children }) => (
    <html>
    <head>
        <title>Hono Users</title>
        <link rel="stylesheet" href="https://matcha.mizu.sh/matcha.css" />
    </head>
    <body>
    <header>
        <h1>Hono Users</h1>
    </header>
    {children}
    </body>
    </html>
);

function UserList({ users }: { users: User[] }) {
    return (
        <Layout>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </Layout>
    );
}

const users: User[] = [
    {
        id: 1,
        name: "Elias",
    },
];

usersRouter.get("/html", (c) => {
    return c.html(<UserList users={users} />);
});


usersRouter.get("/" ,(c) => {
    return c.json({users})
})

usersRouter.get("/:id", (c) => {
    const id = c.req.param("id");
    const user = users.find((u) => u.id === parseInt(id));
    if (!user) {
        return c.json({ error: "User not found" }, 404); // Responder con un código de estado 404 si no se encuentra el usuario
    }
    return c.json(user); // Si el usuario existe, devolver los datos del usuario en la respuesta
});


usersRouter.post("/",
    zValidator(
        "json",
        z.object({
        name: z.string(),
    })
    ),
    async (c) => {
    const body =  c.req.valid("json")

        users.push({
            id: users.length + 1,
            name: body.name,
        })

    return c.json({message: "User created"})

})

usersRouter.delete("/:id", (c) => {
    const id = c.req.param("id");
    const index = users.findIndex((u) => u.id === parseInt(id));
    if (index === -1) {
        return c.json({ error: "User not found" }, 404); // Responder con un código de estado 404 si no se encuentra el usuario
    }
    users.splice(index, 1);
    return c.json({ message: "User deleted" }); // Si el usuario existe, devolver un mensaje de éxito
});

export default usersRouter;


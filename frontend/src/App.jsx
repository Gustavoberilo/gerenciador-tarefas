import { useEffect, useState } from "react"

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState("")

  // Cadastro
  async function handleRegister(e) {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!")
        setIsRegistering(false)
      } else {
        alert(data.erro || "Erro ao cadastrar")
      }

    } catch (error) {
      console.error("Erro no cadastro:", error)
    }
  }

  // LOGIN
  async function handleLogin(e) {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.token) {
        alert("Login inválido")
        return
      }

      localStorage.setItem("token", data.token)
      setIsAuthenticated(true)

      fetchTasks()
    } catch (error) {
      console.error("Erro no login:", error)
    }
  }

  // LOGOUT
  function handleLogout() {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setTasks([])
  }

  // BUSCAR TASKS
  async function fetchTasks() {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:3000/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      console.log("TASKS:", data)

      setTasks(Array.isArray(data) ? data : [])

    } catch (error) {
      console.error("Erro ao buscar tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      setIsAuthenticated(true)
      fetchTasks()
    }
  }, [])

  // CRIAR TASK
  async function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim()) return

    try {
      const token = localStorage.getItem("token")

      await fetch("http://localhost:3000/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      })

      setTitle("")
      fetchTasks()
    } catch (error) {
      console.error("Erro ao criar task:", error)
    }
  }

  // DELETAR
  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja deletar?")) return

    try {
      const token = localStorage.getItem("token")

      await fetch(`http://localhost:3000/task/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      fetchTasks()
    } catch (error) {
      console.error("Erro ao deletar:", error)
    }
  }

  // TOGGLE
  async function handleToggle(id) {
    try {
      const token = localStorage.getItem("token")

      await fetch(`http://localhost:3000/task/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      fetchTasks()
    } catch (error) {
      console.error("Erro ao atualizar:", error)
    }
  }

  // TELA DE LOGIN
 if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>{isRegistering ? "Cadastro" : "Login"}</h2>

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>

          {isRegistering && (
            <>
              <input
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
            </>
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          <button type="submit">
            {isRegistering ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <br />

        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? "Já tem conta? Fazer login"
            : "Não tem conta? Cadastre-se"}
        </button>
      </div>
    )
  }

  // TELA DE TASKS
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Minhas Tasks</h1>

        <button onClick={handleLogout} style={styles.logout}>
          Sair
        </button>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite uma tarefa"
          />
          <button style={styles.button} type="submit" disabled={loading}>
            Adicionar
          </button>
        </form>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <ul style={styles.list}>
            {tasks.map((task) => (
              <li key={task.id} style={styles.task}>
                <div>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggle(task.id)}
                  />

                  <span
                    style={{
                      marginLeft: "10px",
                      textDecoration: task.done ? "line-through" : "none",
                      color: task.done ? "#888" : "#000",
                    }}
                  >
                    {task.title}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(task.id)}
                  style={styles.delete}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  task: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #eee",
  },
  delete: {
    background: "#ff4d4f",
    border: "none",
    color: "#fff",
    padding: "5px 8px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  logout: {
    marginBottom: "10px",
    background: "#333",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
}
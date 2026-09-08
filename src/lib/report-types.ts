export const report_types = {
  datamisinfo: {
    name: "Data Misinformation",
    description: "To notify all the contributors team about a public data published and re investigate for validation.",
    public: true
  },
  security: {
    name: "Security Concerns",
    description: "To notify all the maintainers about a possible security concern.",
    public: true
  },
  sysvuln: {
    name: "System Vulnerability",
    description: "To notify all maintainers about vulnerability perform by any of the contributors.",
    public: false
  },
  racist: {
    name: "Racism",
    description: "The one who violated the code of conduct.",
    public: false
  },
  bias: {
    name: "Personal Bias",
    description: "If a validator declines an information because he/she don't want someone involved on it.",
    public: false
  }
}

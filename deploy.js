import FtpDeploy from "ftp-deploy";

const ftpDeploy = new FtpDeploy();

const config = {
  user: "u125964618",
  password: "Moussa@Cedrick123", // ⚠️ change-le rapidement car tu l'as posté publiquement
  host: "46.202.172.180",
  port: 21,
  localRoot: "./dist", // dossier généré par Vite
  remoteRoot: "/public_html/",
  include: ["*", "**/*"],
  deleteRemote: true,
  forcePasv: true,
};

ftpDeploy
  .deploy(config)
  .then(res => console.log("✅ Deployment completed:", res))
  .catch(err => console.error("❌ FTP Deployment error:", err));

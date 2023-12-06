export class EmprestimoController {
  constructor (emprestimoService) {
    this.base = '/emprestimos';
    this.emprestimoService = emprestimoService;
  }

  async getPendings(req, res) {
    try {
      const { inicio, fim, sala, comProfessor } = req.query;
      const pendings = await this.emprestimoService.findPendings({inicio, fim, sala, comProfessor})
      
      return res.status(200).json(pendings);
    }catch(error){
      res.status(500).json(error);
    }
  }

  async giveRoom(req, res) {
    try {
      const {room} = req.query;
      const emprestimo = await this.emprestimoService.giveRoom(room);
      
      return res.status(200).json(emprestimo);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async giveBackRoom(req, res) {
    try {
      const { room } = req.query;
      const emprestimo = await this.emprestimoService.giveBackRoom(room);

      return res.status(200).json(emprestimo);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
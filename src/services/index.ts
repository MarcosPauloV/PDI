import AmpliacaoBilinear1024 from "./filtros/ampliaçaoIB1024";
import AmpliacaoBilinear512 from "./filtros/ampliaçaoIB512";
import compressao from "./filtros/compressao";
import Equalizacao from "./filtros/equalizacao";
import EspelhamentoHorizontal from "./filtros/espelhamentoH";
import EspelhamentoVertical from "./filtros/espelhamentoV";
import Expansao from "./filtros/expansao";
import Highbost from "./filtros/highboost";
import InterpolacaoRepli512 from "./filtros/interpolacaoreplicacao512";
import InterpolacaoRepli1024 from "./filtros/interpolacaoreplicacao1024";
import Laplaciano from "./filtros/laplaciano";
import Logaritmo from "./filtros/logaritmo";
import LogaritmoInverso from "./filtros/logaritmoInverso";
import Maximo from "./filtros/max";
import Media from "./filtros/media";
import Mediana from "./filtros/mediana";
import Minimo from "./filtros/min";
import Moda from "./filtros/moda";
import Negativo from "./filtros/negativo";
import Potencia from "./filtros/potencia";
import Prewitt from "./filtros/prewitt";
import Raiz from "./filtros/raiz";
import Rotacao90Antihorario from "./filtros/rotacao90ah";
import Rotacao90Horario from "./filtros/rotacao90h";
import Rotacao180 from "./filtros/rotacao180";
import Sobel from "./filtros/sobel";
import Soma from "./filtros/soma";

const Filters = {
  AmpliacaoBilinear1024,
  AmpliacaoBilinear512,
  compressao,
  Equalizacao,
  EspelhamentoHorizontal,
  EspelhamentoVertical,
  Expansao,
  Highbost,
  InterpolacaoRepli512,
  InterpolacaoRepli1024,
  Laplaciano,
  Logaritmo,
  LogaritmoInverso,
  Maximo,
  Media,
  Mediana,
  Minimo,
  Moda,
  Negativo,
  Potencia,
  Prewitt,
  Raiz,
  Rotacao90Antihorario,
  Rotacao90Horario,
  Rotacao180,
  Sobel,
  Soma,
};

export default Filters;

# Convierte guion_clase.md en HTML público (sin datos privados) y lo inserta en app/profes.html entre marcadores.
import re, sys, markdown
B="/home/ucielp/ChorosteckiLab/software/antigravity/kids/dia_de_la_ciencia/"
md=open(B+"guion_clase.md").read()
md=re.sub(r"\n### Souvenir.*?(?=\n---|\n## )","\n",md,flags=re.S)          # material solo para una clase concreta
md=re.sub(r"\nOjo: la Clara del equipo[^\n]*\n","\n",md)                      # nombre privado
md=md.split("\n",1)[1]                                                       # quitar el título (la página ya lo tiene)
for bad in ["Souvenir","souvenir","Clara del cole","clase de Clara","@"]:
    assert bad not in md, bad
# python-markdown necesita una línea en blanco antes de una lista
md=re.sub(r"(?m)^((?![-*] |\d+\. |>|\||#)[^\n]*\S)\n(?=(?:[-*] |\d+\. ))",r"\1\n\n",md)
md=re.sub(r"(?m)^  ([-*] )",r"    \1",md)  # sublistas con 2 espacios
html=markdown.markdown(md,extensions=["tables","sane_lists"])
html=re.sub(r"<(/?)h([1-4])",lambda m:f"<{m.group(1)}h{int(m.group(2))+1}",html)
html=html.replace("<table>",'<div class="tw"><table>').replace("</table>","</table></div>")
p=B+"app/profes.html"; s=open(p).read()
a,b="<!-- GUION:START -->","<!-- GUION:END -->"
i,j=s.index(a)+len(a),s.index(b)
s=s[:i]+"\n"+html+"\n"+s[j:]
open(p,"w").write(s); print("ok",len(html))

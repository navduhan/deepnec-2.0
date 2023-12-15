import requests as r
from Bio import SeqIO
from io import StringIO
from Bio import Entrez
import sys
cID=sys.argv[2]
db=sys.argv[1]


if db=='uniprot':

    baseUrl="http://www.uniprot.org/uniprot/"
    currentUrl=baseUrl+cID+".fasta"
    response = r.post(currentUrl)
    cData=''.join(response.text)

    Seq=StringIO(cData)
    pSeq=SeqIO.parse(Seq,'fasta')
    for p in pSeq:
        print(p.id,"\n",p.seq,"\n")
elif db=='ncbi':
    Entrez.email = 'duhan27dec@gmail.com'
    pSeq=Entrez.efetch(db='protein', id=cID, rettype='fasta', retmode='text')
    print(pSeq.read())

#!/bin/sh

for person in "glenn.searby" "annette.lamley" "joshua.thumim" "tom.hinton" "martin.holley"; do
    mediawiki-main-createAndPromote --bureaucrat --sysop "$person@cse.org.uk" "$person"
done

for person in "k.kuriyan@imperial.ac.uk" "a.pantaleo@imperial.ac.uk" "m.aunedi@imperial.ac.uk" "david.birch@imperial.ac.uk" "g.strbac@imperial.ac.uk" "n.shah@imperial.ac.uk" "simon.wyke@london.gov.uk" "peter.north@london.gov.uk" "Roberto.GagliardilaGala@london.gov.uk" "Lucy.Padfield@islington.gov.uk" "james.wilson@islington.gov.uk" "pms@creara.es" "ipp@creara.es" "comunicacion@creara.es" "mchillida@ajuntament.granollers.cat" "acamps@ajuntament.granollers.cat" "smorera@ajuntament.granollers.cat" "mvives@ajuntament.granollers.cat" "jogrodniczuk@kape.gov.pl" "mkarolak@kape.gov.pl" "pchrzanowski@kape.gov.pl" "kkacpura@um.warszawa.pl" "dkunicka@um.warszawa.pl" "mkesik@um.warszawa.pl" "egils.zarins@lvif.gov.lv" "Aija.Zucika@lvif.gov.lv" "aina.bataraga@fortum.com" "Gunita.Osite@dome.jelgava.lv" "valdis.rieksts-riekstins@fortum.com" "steffenn@plan.aau.dk" "david@plan.aau.dk " "nif@plan.aau.dk" "susana@plan.aau.dk" "iva@plan.aau.dk" "carsten.rothballer@iclei.org" "emilie.doran@iclei.org" "michele.zuin@iclei.org" "dorfinger@dena.de" "neussel@dena.de" "marilena_seemann@hotmail.com" "cristiana.fica@yahoo.com" "joao.dinis@cm-cascais.pt" "Fernando.pais@cascaisambiente.pt"; do
    mediawiki-main-createAndPromote --force "$person" "thermos";
done

mediawiki-main-createAndPromote --force --sysop "james.wilson@islington.gov.uk"
mediawiki-main-createAndPromote --force --sysop "ipp@creara.es"

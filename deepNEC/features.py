#!/usr/bin/python3
# Author: Naveen Duhan
# Canonical file name: protein_features.py
"""
Protein Sequence Feature Extraction Library
===========================================
Author: Naveen Duhan

This module provides the ``FEATURE`` class, which encodes protein amino acid
sequences as fixed-length numerical vectors suitable for training deep learning
and machine learning classifiers.

Dependency: feature_data.py  (amino acid property constants)

FEATURE methods and output vector sizes
---------------------------------------
Composition-based:
  AAC()             Amino Acid Composition                              20
  DPC()             Dipeptide Composition                              400
  DPCP()            Dipeptide Composition + physicochemical props      1200
  TPC()             Tripeptide Composition                            8000
  AAC_NEW()         AAC extended with per-residue properties           200
  AAC_P()           AAC extended with Hydrophobicity/EIIP              220

Structure / property-based:
  CTD()             Composition-Transition-Distribution (full)         168
  CTDC()            CTD Composition component only                      39
  CTDT()            CTD Transition component only                       39

Correlation / auto-correlation:
  NMBroto()         Normalised Moreau-Broto autocorrelation (lag=30)   240
  PAAC()            Pseudo Amino Acid Composition (lambda=30)           50
  QSO()             Quasi-Sequence-Order (max=30, w=0.1)               100

Triad / pair encoding:
  conjoint()        Conjoint Triad                                      343
  norm_conjoint()   Normalised Conjoint Triad                           343
  CKSAAP(k=5)       k-Spaced Amino Acid Pairs          400 × (k+1) = 2400

Binary:
  BINARY(n, L)      Binary / positional encoding                    n*L

Hybrid concatenations:
  hybrid(seq, f1, f2)       Concatenate two feature vectors
  hybrid2(seq, f1, f2, f3)  Concatenate three feature vectors

Pre-built hybrid feature sizes (as used in neminer_utils.py):
  DPC_AAC            DPC + AAC                                        420
  DPC_NM             DPC + NMBroto                                    640
  DPC_NM_CONJOINT    DPC + conjoint + NMBroto                         983
  TPC_DPCP           TPC + DPCP                                      9200
  TPC_CKSAAP         TPC + CKSAAP(k=5)                              10400
"""

import copy, math, os, re
import numpy as np
from deepNEC.feature_data import *

# Feature class

class FEATURE:
    """
    Class for protein feature generation from amino acid sequences for training
    """


    def __init__(self):
        self.AA=AA
        self.AAP=AAP
        self.AAG=AAG
        self._conj=conj
        self.gr=gr
        self.sw=sw
        self.AADict=AADict
        self.AAProperty=AAProperty
        self.AAProperty1=AAProperty1
        self.AAidx=AAidx
        self.groups=groups
        self.property=property
        self.table=table
        self.protein_eiip= protein_eiip
        self.Hydrophobicity = Hydrophobicity
        self.Hydrophilicity = Hydrophilicity
        self.sidechains = sidechains

    # Amino acid composition vector size(20)
    def AAC(self, seq):
        """
        Amino Acid Composition (AAC).

        Computes the frequency of each of the 20 standard amino acids
        as a percentage of the total sequence length.

        Frequency(AA_i) = count(AA_i) / N * 100

        Vector size = 20  (one value per amino acid, ordered as self.AA)
        """
        N = len(seq)
        aac = []
        for i in self.AA:
            i = round(float(seq.count(i)) / N * 100, 2)
            aac.append(i)
        return aac

    def AAC_nt(self, seq, N):
        """
        Amino Acid Composition — N-terminal region.

        Computes AAC over the first N residues of the sequence.

        Vector size = 20
        """
        aac_nt = []
        sub_str = seq[0:N]
        for i in self.AA:
            count = 0
            for j in sub_str:
                tp = j
                if tp == i:
                    count += 1
                nt = round(float(count / N) * 100, 2)
                aac_nt.append(nt)
        return aac_nt

        # Amino acid composition C-terminal residue

    def AAC_ct(self, seq, N):
        """
        Amino Acid Composition — C-terminal region.

        Computes AAC over the last N residues of the sequence.

        Vector size = 20
        """
        aac_ct = []
        sub_str = seq[-N:]
        for i in self.AA:
            count = 0
            for j in sub_str:
                tp = j
                if tp == i:
                    count += 1
                nt = round(float(count / N) * 100, 2)
                aac_ct.append(nt)
        return aac_ct

    def DPC(self, seq):
        """
        Dipeptide Composition (DPC).

        Computes the frequency of each of the 400 possible consecutive
        amino acid pairs (di-peptides) in the sequence.

        Frequency(AA_i, AA_j) = count(AA_i AA_j) / (N-1) * 100

        Vector size = 400  (20 × 20, ordered as self.AA × self.AA)
        """
        N = len(seq)
        dpc = []
        for i in self.AA:
            for j in self.AA:
                dp = i + j
                dp = round(float(seq.count(dp)) / (N - 1) * 100, 2)
                dpc.append(dp)
        return dpc

    def DPCP(self, seq):
        """
        Dipeptide Composition + Physicochemical properties (DPCP).

        For each of the 400 dipeptides, appends three values:
          1. Frequency  = count(dp) / (N-1) * 100
          2. Raw count  = count(dp)
          3. Sneath-Sokal distance (sw) for the pair

        Vector size = 1200  (400 dipeptides × 3 values each)
        """
        N = len(seq)
        dpc = []
        for i in self.AA:
            for j in self.AA:
                dp = i + j
                dpk = round(float(seq.count(dp)) / (N - 1) * 100, 2)
                dpc.append(dpk)
                dpc.append(seq.count(dp))
                dpc.append(self.sw[dp])
        return dpc

    def TPC(self, seq):
        """
        Tripeptide Composition (TPC).

        Computes the frequency of each of the 8000 possible consecutive
        amino acid triplets in the sequence.

        Frequency(AA_i, AA_j, AA_k) = count(tripeptide) / (N-1) * 100

        Vector size = 8000  (20³, ordered as self.AA × self.AA × self.AA)
        """
        N = len(seq)
        tpc = []
        for i in self.AA:
            for j in self.AA:
                for k in self.AA:
                    tripep = i + j + k
                    tripep = round(float(seq.count(tripep)) / (N - 1) * 100, 2)
                    tpc.append(tripep)
        return tpc

    def AAC_NEW(self, seq):
        """
        Extended Amino Acid Composition with physicochemical properties (AACN).

        For each amino acid appends:
          - raw count
          - frequency (%)
          - 7 physicochemical properties from `table` (MW, volume, ASA,
            H-bond donors, rotatable bonds, hydrophobicity, pI)
          - EIIP (electron-ion interaction pseudo-potential)

        Vector size = 20 × (1 + 1 + 7 + 1) = 200
        """
        N = len(seq)
        aac = []
        for i in AA:
            j = round(float(seq.count(i)) / N * 100, 2)
            data = table[i]
            aac.append(seq.count(i))
            aac.append(j)
            for k in self.table[i]:
                aac.append(k)
            aac.append(self.protein_eiip[i])
        return aac

    def AAC_P(self, seq):
        """
        Extended Amino Acid Composition with hydrophobicity/EIIP (AACP).

        For each amino acid appends:
          - raw count
          - frequency (%)
          - 7 values from `table`
          - Kyte-Doolittle Hydrophobicity
          - Parker Hydrophilicity
          - Sidechain volume
          - EIIP

        Vector size = 20 × (1 + 1 + 7 + 1 + 1 + 1 + 1) = 260
        Note: actual size may vary depending on `table` contents.
        """
        N = len(seq)
        aac = []
        for i in AA:
            j = round(float(seq.count(i)) / N * 100, 2)
            aac.append(seq.count(i))
            aac.append(j)
            for k in self.table[i]:
                aac.append(k)
            aac.append(self.Hydrophobicity[i])
            aac.append(self.Hydrophilicity[i])
            aac.append(self.sidechains[i])
            aac.append(protein_eiip[i])
        return aac



    # ── CTD internal helpers ──────────────────────────────────────────────
    def str2n(self, seq, property):
        """
        Sequence-to-number encoder for CTD.

        Replaces each amino acid in `seq` with its group label ('1', '2',
        or '3') according to the given `property` grouping dict.  Used
        internally by CalculateComposition, CalculateTransition, and
        CalculateDistribution.

        Parameters
        ----------
        seq      : str   amino acid sequence
        property : dict  mapping group label → list of amino acids
                         e.g. {'1': ['A','G',...], '2': ['R','K',...], '3': [...]}

        Returns
        -------
        str : sequence with each residue replaced by its group index ('1'/'2'/'3')
        """
        prot = copy.deepcopy(seq)
        for k, m in property.items():
            for index in m:
                prot = str.replace(prot, index, k)
        return prot

    def CalculateComposition(self, protseq, property):
        """
        CTD — Composition sub-calculator.

        For a single physicochemical property, computes the fraction of
        residues falling into each of 3 property groups after encoding
        the sequence with str2n().

        Returns
        -------
        list of 3 floats [f_group1, f_group2, f_group3]
          where f_groupN = count('N') / sequence_length
        """
        tprotseq = self.str2n(protseq, property)
        result = []
        N = len(tprotseq)
        a = round(float(tprotseq.count('1')) / N, 5)
        b = round(float(tprotseq.count('2')) / N, 5)
        c = round(float(tprotseq.count('3')) / N, 5)
        result.append(a)
        result.append(b)
        result.append(c)
        return result

    def CalculateTransition(self, protseq, property):
        """
        CTD — Transition sub-calculator.

        For a single physicochemical property, computes the fraction of
        adjacent residue pairs that switch between property groups after
        encoding the sequence with str2n().

        Three transition types counted:
          a = (1→2 + 2→1) / (N - 1)
          b = (1→3 + 3→1) / (N - 1)
          c = (2→3 + 3→2) / (N - 1)

        Returns
        -------
        list of 3 floats [t_12, t_13, t_23]
        """
        tprotseq = self.str2n(protseq, property)
        result = []
        N = len(tprotseq)
        a = round(float(tprotseq.count('12') + tprotseq.count('21')) / (N - 1), 5)
        b = round(float(tprotseq.count('13') + tprotseq.count('31')) / (N - 1), 5)
        c = round(float(tprotseq.count('23') + tprotseq.count('32')) / (N - 1), 5)
        result.append(a)
        result.append(b)
        result.append(c)
        return result

    def CalculateDistribution(self, protseq, property):
        """
        CTD — Distribution sub-calculator.

        For a single physicochemical property, finds the sequence positions
        of residues in each group (after encoding with str2n()), then records
        five percentile positions (as % of sequence length) for each group:

          Position of the  1st  residue in the group  (0th   percentile)
          Position of the 25th  percentile residue
          Position of the 50th  percentile residue     (median)
          Position of the 75th  percentile residue
          Position of the last  residue in the group   (100th percentile)

        If a group contains no residues, all five values are set to 0.

        Returns
        -------
        list of 15 floats  [g1_p0, g1_p25, g1_p50, g1_p75, g1_p100,
                            g2_p0, ..., g3_p100]
        """
        tprotseq = self.str2n(protseq, property)
        Result = []
        Num = len(tprotseq)
        temp = ('1', '2', '3')
        for i in temp:
            num = tprotseq.count(i)
            ink = 1
            indexk = 0
            cds = []
            while ink <= num:
                indexk = str.find(tprotseq, i, indexk) + 1
                cds.append(indexk)
                ink = ink + 1

            if cds == []:
                Result.extend([0, 0, 0, 0, 0])
            else:
                a = round(float(cds[0]) / Num * 100, 5)
                b = round(float(cds[int(math.floor(num * 0.25)) - 1]) / Num * 100, 5)
                c = round(float(cds[int(math.floor(num * 0.5))  - 1]) / Num * 100, 5)
                d = round(float(cds[int(math.floor(num * 0.75)) - 1]) / Num * 100, 5)
                e = round(float(cds[-1]) / Num * 100, 5)
                Result.extend([a, b, c, d, e])
        return Result
    def CTD(self, seq, desc='ctd'):
        """
        Composition-Transition-Distribution (CTD).

        Encodes the sequence using three descriptors across 13 physicochemical
        properties (hydrophobicity ×7, normalised VDWV, polarity,
        polarizability, charge, secondary structure, solvent accessibility):

          Composition  (C): fraction of residues in each of 3 property groups.
          Transition   (T): fraction of adjacent pairs switching between groups.
          Distribution (D): positions of the 1st, 25th, 50th, 75th, 100th
                            percentile residues in each group.

        desc parameter controls which components to include:
          'ctd' (default) → all three  → 13 × (3+3+15) = 273  (full)
          'c'  → composition only      → 13 × 3  =  39
          't'  → transition only       → 13 × 3  =  39
          'd'  → distribution only     → 13 × 15 = 195

        As called with default desc='ctd': Vector size = 168
        (legacy sizing — actual depends on property list length)
        """
        result = []
        get_C = True
        get_T = True
        get_D = True
        desc = desc.lower()
        if 'c' not in desc:
            get_C = False
        if 't' not in desc:
            get_T = False
        if 'd' not in desc:
            get_D = False
        for i in range(len(self.AAG)):
            property = self.AAP[i]
            if get_C:
                result.extend(self.CalculateComposition(seq, property))
            if get_T:
                result.extend(self.CalculateTransition(seq, property))
            if get_D:
                result.extend(self.CalculateDistribution(seq, property))
        return result
    # Conjoint Triad
    def s2n(self,seq):
        conj = {}
        for i in self._conj:
            for j in self._conj[i]:
                conj[j] = i

        res = seq
        for i in conj:
            res = res.replace(i, str(conj[i]))
        return res
    def conjoint(self, seq):
        """
        Conjoint Triad (conjoint).

        Maps each amino acid to one of 7 pharmacochemical groups, then
        counts the frequency of every consecutive group-triplet.

        Vector size = 7³ = 343  (raw counts, not normalised)
        """
        result = []
        proteinnum = self.s2n(seq)
        for i in range(1, 8):
            for j in range(1, 8):
                for k in range(1, 8):
                    temp = str(i) + str(j) + str(k)
                    count = proteinnum.count(temp)
                    result.append(count)
        return result

    def norm_conjoint(self, seq):
        """
        Normalised Conjoint Triad (norm_conjoint).

        Same as conjoint() but min-max normalised so all values lie in [0, 1].

        val_normalised = (val - min) / max

        Vector size = 343
        """
        data = self.conjoint(seq)
        fmax = max(data)
        fmin = min(data)
        result = []
        for l in range(0, len(data)):
            val = float((data[l] - fmin) / fmax)
            result.append(val)
        return result

# Quasi order 1 and 2 based on Grantham chemical distance  vector size(168)
    # Sequence-order-coupling number
    def cn(self, seq, rank, matrix):
        length = len(seq)
        _cn = []
        for i in range(length - rank):

            a = seq[i]
            b = seq[i + rank]
            # print(a)
            # print(b)
            # print(self.gr[a + b])
            _cn.append(math.pow(matrix[a + b], 2))


        return _cn

    def cnu(self, seq, max, matrix):
        length = len(seq)
        _cn = []
        for i in range(max):
            _cn.append(self.cn(seq, i + 1, matrix))
        # print(_cn)
        return _cn[0]

    def QSO(self, seq, max=30, w=0.1):
        """
        Quasi-Sequence-Order (QSO).

        Combines amino acid composition with sequence-order coupling numbers
        derived from both the Grantham (gr) and Sneath-Sokal (sw) distance
        matrices up to lag `max`.

        The coupling number at lag r:
          θ_r = Σ_{i=1}^{N-r} d(seq[i], seq[i+r])²  /  (N - r)

        Normalised QSO descriptor:
          f(AA_i)    = count(AA_i)  /  (1 + w × Σθ)
          f(lag_r)   = w × θ_r      /  (1 + w × Σθ)

        Four blocks are concatenated: gr-aa, gr-lag, sw-aa, sw-lag.

        Parameters
        ----------
        max : int   maximum lag (default 30)
        w   : float weighting factor (default 0.1)

        Vector size = 4 × max = 120  (default: 4 × 30 = 120)
        Note: as called in data_utils.py with max=30 → size = 100
        """
        data = []
        data_sw = []
        for i in range(max):
            data.append(self.cnu(seq, i + 1, self.gr))
        for i in range(max):
            data_sw.append(self.cnu(seq, i + 1, self.sw))
        caa = self.AAC(seq)
        qs1, qs2, qs11, qs22 = [], [], [], []
        a_gr = 1 + (w * sum(data[0]))
        a_sw = 1 + (w * sum(data_sw[0]))
        for i, j in enumerate(self.AA):
            qs1.append(round(caa[i] / a_sw, 10))
            qs11.append(round(caa[i] / a_gr, 10))
        for i in range(20, 20 + max):
            qs2.append(float(round(w * data[0][i - 20] / a_sw, 10)))
            qs22.append(float(round(w * data_sw[0][i - 20] / a_gr, 10)))
        result = qs1
        result.extend(qs2)
        result.extend(qs11)
        result.extend(qs22)
        return result

    def Rvalue(self,aa1, aa2, AADict, Matrix):
        return sum([(Matrix[i][AADict[aa1]] - Matrix[i][AADict[aa2]]) ** 2 for i in range(len(Matrix))]) / len(Matrix)

    def PAAC(self, seqStr, lambdaValue=30, w=0.05, **kw):
        """
        Pseudo Amino Acid Composition (PAAC).

        Extends AAC by appending `lambdaValue` pseudo-components that
        capture sequence-order information via the correlation factor θ_n:

          θ_n = Σ_{j=1}^{N-n} R(seq[j], seq[j+n])  /  (N - n)

        where R is a function of the three standardised physicochemical
        properties (hydrophobicity, hydrophilicity, residue volume).

        The descriptor vector:
          f(AA_i) = count(AA_i) / (1 + w × Σθ)        (20 values)
          f(θ_n)  = w × θ_n    / (1 + w × Σθ)         (lambdaValue values)

        Parameters
        ----------
        lambdaValue : int   maximum correlation lag (default 30)
        w           : float weighting factor          (default 0.05)

        Vector size = 20 + lambdaValue  →  default = 50
        """
        theta = []
        code = []
        for n in range(1, lambdaValue + 1):
            theta.append(
                sum([self.Rvalue(seqStr[j], seqStr[j + n], self.AADict, self.AAProperty1)
                     for j in range(len(seqStr) - n)]) / (len(seqStr) - n)
            )
        myDict = {}
        for aa in AA:
            myDict[aa] = seqStr.count(aa)
        code = [myDict[aa] / (1 + w * sum(theta)) for aa in AA]
        code = code + [(w * j) / (1 + w * sum(theta)) for j in theta]
        return code

    def NMBroto(self, seq, nlag=30):
        """
        Normalised Moreau-Broto Autocorrelation (NMBroto).

        Computes autocorrelation descriptors for 8 normalised amino acid
        property indices (AAidx) at lags 1 to `nlag`.

        For property p at lag n:
          rn = Σ_{j=1}^{N-n} AAidx[p][seq[j]] × AAidx[p][seq[j+n]]  /  (N - n)

        The 8 properties are z-score standardised before computation.
        If the sequence is shorter than nlag, rn = 0 for that lag.

        Parameters
        ----------
        nlag : int   maximum autocorrelation lag (default 30)

        Vector size = 8 × nlag  →  default = 240
        """
        pstd = np.std(self.AAidx, axis=1)
        pmean = np.average(self.AAidx, axis=1)
        for i in range(len(self.AAidx)):
            for j in range(len(self.AAidx[i])):
                AAidx[i][j] = (self.AAidx[i][j] - pmean[i]) / pstd[i]
        code = []
        N = len(seq)
        for prop in range(8):
            for n in range(1, nlag + 1):
                if len(seq) > nlag:
                    rn = sum(
                        [AAidx[prop][self.AADict.get(seq[j], 0)] *
                         AAidx[prop][self.AADict.get(seq[j + n], 0)]
                         for j in range(len(seq) - n)]
                    ) / (N - n)
                else:
                    rn = 0
                code.append(rn)
        return code

    def Count(self,seq1, seq2):
        sum = 0
        for aa in seq1:
            sum = sum + seq2.count(aa)
        return sum

    def CTDC(self, seq):
        """
        CTD — Composition component only (CTDC).

        For each of the 13 physicochemical properties, computes the fraction
        of residues belonging to each of the 3 property groups.

        c1 = count(group1 residues) / N
        c2 = count(group2 residues) / N
        c3 = 1 - c1 - c2

        Vector size = 13 × 3 = 39
        """
        code = []
        for p in self.property:
            c1 = self.Count(group1[p], seq) / len(seq)
            c2 = self.Count(group2[p], seq) / len(seq)
            c3 = 1 - c1 - c2
            code = code + [c1, c2, c3]
        return code

    def CTDT(self, sequence):
        """
        CTD — Transition component only (CTDT).

        For each of the 13 physicochemical properties, computes the fraction
        of adjacent residue pairs that transition between property groups:

          c1221 : fraction of group1↔group2 transitions
          c1331 : fraction of group1↔group3 transitions
          c2332 : fraction of group2↔group3 transitions

        Vector size = 13 × 3 = 39
        """
        code = []
        aaPair = [sequence[j:j + 2] for j in range(len(sequence) - 1)]
        for p in self.property:
            c1221, c1331, c2332 = 0, 0, 0
            for pair in aaPair:
                if (pair[0] in group1[p] and pair[1] in group2[p]) or (pair[0] in group2[p] and pair[1] in group1[p]):
                    c1221 += 1
                    continue
                if (pair[0] in group1[p] and pair[1] in group3[p]) or (pair[0] in group3[p] and pair[1] in group1[p]):
                    c1331 += 1
                    continue
                if (pair[0] in group2[p] and pair[1] in group3[p]) or (pair[0] in group3[p] and pair[1] in group2[p]):
                    c2332 += 1
            code = code + [c1221 / len(aaPair), c1331 / len(aaPair), c2332 / len(aaPair)]
        return code
    def BINARY(self, seq, sampleCount, sampleLen):
        """
        Binary / Positional Encoding (BINARY).

        Samples `sampleCount` windows of length `sampleLen` from the sequence
        at evenly-spaced positions (or pads short sequences with '-'), then
        one-hot encodes each residue position against the 20-AA alphabet.

        Parameters
        ----------
        sampleCount : int   number of sampled windows (e.g. 4)
        sampleLen   : int   length of each window     (e.g. 150)

        Vector size = sampleCount × sampleLen × 20
                    = 4 × 150 × 20 = 12000  (with defaults used in data_utils)
        Note: actual returned structure is a flat list of 0/1 integers.
        """
        gap = (len(seq) - sampleCount * sampleLen) / sampleCount
        res = ''
        if gap < 0:
            res = seq + ('-' * (sampleCount * sampleLen - len(seq)))
        else:
            pos = 0
            for i in range(0, sampleCount):
                res += seq[pos:pos + sampleLen]
                pos += math.floor(gap)
        if len(res) != sampleCount * sampleLen:
            print('Err' + str(len(res)))
            exit()
        code = []
        for a in seq:
            if a == '-':
                code.append([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            for aa in self.AA:
                tag = 1 if a == aa else 0
                code.append(tag)
        return code

    def CKSAAP(self, seq, k=5):
        """
        Composition of k-Spaced Amino Acid Pairs (CKSAAP).

        For each spacing d in [0, k], compute the frequency of every one of
        the 400 (20×20) amino-acid pairs whose constituent residues are
        separated by exactly d positions in the sequence.

        Frequency(AA_i, AA_j, d) = count(AA_i, AA_j, d) / (N - d - 1) * 100

        Default k=5  →  vector size = 400 × (5+1) = 2400
        """
        N = len(seq)
        result = []
        for d in range(k + 1):
            n_pairs = N - d - 1
            if n_pairs <= 0:
                # sequence too short for this spacing — fill with zeros
                result.extend([0.0] * 400)
                continue
            # count occurrences of every k-spaced pair efficiently
            pair_counts = {}
            for i in range(n_pairs):
                pair = seq[i] + seq[i + d + 1]
                pair_counts[pair] = pair_counts.get(pair, 0) + 1
            for aa1 in self.AA:
                for aa2 in self.AA:
                    freq = round(
                        float(pair_counts.get(aa1 + aa2, 0)) / n_pairs * 100, 2
                    )
                    result.append(freq)
        return result

    def hybrid(self, seq, f1, f2):
        """
        Hybrid — concatenate two feature vectors.

        Calls f1(seq) and f2(seq) and concatenates the results.
        Both f1 and f2 must be bound methods of FEATURE.

        Vector size = len(f1(seq)) + len(f2(seq))

        Example pre-built hybrids (see data_utils.py):
          DPC_AAC        → hybrid(seq, f.DPC, f.AAC)         = 420
          DPC_NM         → hybrid(seq, f.DPC, f.NMBroto)     = 640
          TPC_DPCP       → hybrid(seq, f.DPCP, f.TPC)        = 9200
          TPC_CKSAAP     → hybrid(seq, f.TPC, f.CKSAAP)      = 10400
          CKSAAP_PAAC    → hybrid(seq, f.CKSAAP, f.PAAC)     = 2450
        """
        a = f1(seq)
        a.extend(f2(seq))
        return a

    def hybrid2(self, seq, f1, f2, f3):
        """
        Hybrid — concatenate three feature vectors.

        Calls f1(seq), f2(seq), f3(seq) and concatenates all three.
        All three must be bound methods of FEATURE.

        Vector size = len(f1(seq)) + len(f2(seq)) + len(f3(seq))

        Example pre-built hybrid (see data_utils.py):
          DPC_NM_CONJOINT → hybrid2(seq, f.DPC, f.conjoint, f.NMBroto)
                          = 400 + 343 + 240 = 983
        """
        a = f1(seq)
        a.extend(f2(seq))
        a.extend(f3(seq))
        return a

    def MOTIF(self, seq):
        """
        Extract structural and cofactor motif features (10-dimensional vector):
        1. CXXCH count (c-type heme binding)
        2. TM window count (transmembrane domains)
        3. CxxC count (Fe-S / disulfide binding)
        4. HxH count (histidine coordination)
        5. Normalized sequence length (length / 1000)
        6. Rossmann fold dinucleotide binding count (G.[GS]..[GA])
        7. NADP+ phosphate-binding basic cluster count ([RK].{1,3}[RK])
        8. NAD+ acidic cluster count ([DE].{1,3}[DE])
        9. Ferredoxin [2Fe-2S]/[4Fe-4S] Cys-cluster count (C.{2,4}C.{2,4}C)
        10. Molybdenum/MGD cofactor binding motif count (C.{3,5}G.{2,4}G)
        """
        # 1. CXXCH count
        cxxch = len(re.findall(r'C.{2}CH', seq))

        # 2. TM window count
        hydrophobic = set('LIVMFYWCA')
        win = 20
        threshold = 0.65
        tm_count = 0
        in_tm = False
        for i in range(len(seq) - win + 1):
            window = seq[i : i + win]
            frac = sum(1 for aa in window if aa in hydrophobic) / win
            if frac >= threshold:
                if not in_tm:
                    tm_count += 1
                    in_tm = True
            else:
                in_tm = False

        # 3. CxxC count
        cxxc = len(re.findall(r'C.{2,3}C', seq))

        # 4. HxH count
        hxh = len(re.findall(r'H.H', seq))

        # 5. Normalized length
        norm_len = len(seq) / 1000.0

        # 6. Rossmann fold dinucleotide binding motif (NAD(P)H)
        rossmann = len(re.findall(r'G.[GS]..[GA]', seq))

        # 7. NADP+ phosphate-binding basic cluster count
        nadp_basic = len(re.findall(r'[RK].{1,3}[RK]', seq))

        # 8. NAD+ acidic cluster count
        nad_acidic = len(re.findall(r'[DE].{1,3}[DE]', seq))

        # 9. Ferredoxin Fe-S Cys cluster count
        ferredoxin = len(re.findall(r'C.{2,4}C.{2,4}C', seq))

        # 10. Molybdenum / MGD cofactor motif count
        mo_mgd = len(re.findall(r'C.{3,5}G.{2,4}G', seq))

        # Scale cofactor motifs by 50x so they carry equal weight to CKSAAP (2400-dim) features
        return [
            float(cxxch), float(tm_count), float(cxxc), float(hxh), float(norm_len),
            float(rossmann) * 50.0, float(nadp_basic) * 50.0, float(nad_acidic) * 50.0,
            float(ferredoxin) * 50.0, float(mo_mgd) * 50.0
        ]


def extract_cksaap(sequence, max_k=5):
    f = FEATURE()
    clean_seq = re.sub(r'[^ARNDCQEGHILKMFPSTWYV]', '', str(sequence).upper())
    return np.array(f.CKSAAP(clean_seq, k=max_k), dtype=np.float32)


def extract_motifs(sequence, scale=50.0):
    f = FEATURE()
    clean_seq = re.sub(r'[^ARNDCQEGHILKMFPSTWYV]', '', str(sequence).upper())
    return np.array(f.MOTIF(clean_seq), dtype=np.float32)


def extract_cksaap_motif(sequence):
    f = FEATURE()
    clean_seq = re.sub(r'[^ARNDCQEGHILKMFPSTWYV]', '', str(sequence).upper())
    return np.array(f.CKSAAP(clean_seq, k=5) + f.MOTIF(clean_seq), dtype=np.float32)


def extract_phase1_descriptors(sequence):
    """
    Extract exact 2,968-dim descriptor vector:
    CKSAAP (2,400) + MOTIF (10) + CTD (168) + PAAC (50) + QSO (100) + NMBroto (240) = 2,968
    Uses the exact training FEATURE class with AA = 'ARNDCQEGHILKMFPSTWYV'.
    """
    feat = FEATURE()
    clean_seq = re.sub(r'[^ARNDCQEGHILKMFPSTWYV]', '', str(sequence).upper())
    f1 = feat.CKSAAP(clean_seq, k=5) + feat.MOTIF(clean_seq)
    f2 = feat.CTD(clean_seq) + feat.PAAC(clean_seq) + feat.QSO(clean_seq) + feat.NMBroto(clean_seq)
    return np.array(f1 + f2, dtype=np.float32)


def extract_esm2_embeddings(sequences, use_lora=False, device=None):
    """
    Extract 1280-dimensional mean-pooled ESM-2 embeddings for a list of sequences.
    If use_lora=True, loads the Fold 5 LoRA adapter model from data/models/phase1/adapter.
    For sequences > 1,022 residues, uses overlapping 1,022-residue windows (128 overlap)
    and averages the mean-pooled embeddings across all evaluation windows.
    Terminates with a clear RuntimeError if ESM-2 extraction fails.
    """
    try:
        import torch
        from transformers import AutoTokenizer, EsmModel, logging as tf_logging
        tf_logging.set_verbosity_error()

        if device is None:
            device = "cuda" if torch.cuda.is_available() else "cpu"

        model_name = "facebook/esm2_t33_650M_UR50D"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        base_model = EsmModel.from_pretrained(model_name)

        if use_lora:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            adapter_path = os.path.join(base_dir, "data", "models", "phase1", "adapter")
            if not os.path.exists(adapter_path):
                raise RuntimeError(f"Phase 1 Fold 5 LoRA adapter path missing: '{adapter_path}'. Cannot compute Phase 1 embeddings without Fold 5 LoRA adapter.")
            try:
                from peft import PeftModel
                model = PeftModel.from_pretrained(base_model, adapter_path).to(device)
            except Exception as peft_err:
                raise RuntimeError(f"Failed to load Phase 1 Fold 5 LoRA adapter from '{adapter_path}': {peft_err}")
        else:
            model = base_model.to(device)

        model.eval()

        embeddings = []
        for seq in sequences:
            seq_str = str(seq).strip().upper()
            invalid_chars = set(re.findall(r'[^ARNDCQEGHILKMFPSTWYV]', seq_str))
            if invalid_chars:
                bad_chars = ", ".join(sorted(list(invalid_chars)))
                raise ValueError(f"Sequence contains invalid/non-standard amino acid character(s): '{bad_chars}'. Only the 20 standard amino acids (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y) are permitted.")
            clean_seq = seq_str

            # Windowing logic for long sequences (> 1022 residues)
            win_size = 1022
            stride = 894  # 1022 - 128 overlap
            if len(clean_seq) <= win_size:
                windows = [clean_seq]
            else:
                windows = []
                for start_idx in range(0, len(clean_seq) - win_size + 1, stride):
                    windows.append(clean_seq[start_idx : start_idx + win_size])
                if (len(clean_seq) - win_size) % stride != 0:
                    windows.append(clean_seq[-win_size:])

            win_embeds = []
            with torch.no_grad():
                for win in windows:
                    inputs = tokenizer(win, return_tensors="pt", padding=False, truncation=True, max_length=1024).to(device)
                    outputs = model(**inputs)
                    last_hidden = outputs.last_hidden_state.squeeze(0)[1:-1]  # Remove CLS/EOS
                    win_embed = last_hidden.mean(dim=0).cpu().numpy()
                    win_embeds.append(win_embed)

            avg_embed = np.mean(win_embeds, axis=0)
            embeddings.append(avg_embed)

        return np.array(embeddings, dtype=np.float32)

    except Exception as e:
        raise RuntimeError(f"ESM-2 embedding extraction failed: {e}") from e


def extract_phase1_features(sequences, esm2_embeddings=None):
    """
    Extract exact 4,248-dim Phase 1 Ultimate Hybrid feature matrix:
    [1,280 ESM-2 (Fold 5 LoRA)] + [2,968 Descriptors] = 4,248 dimensions.
    """
    if esm2_embeddings is None:
        esm2_embeddings = extract_esm2_embeddings(sequences, use_lora=True)

    feature_matrix = []
    for i, seq in enumerate(sequences):
        esm_vec = esm2_embeddings[i]
        desc_vec = extract_phase1_descriptors(seq)
        combined = np.concatenate([esm_vec, desc_vec], axis=0)
        feature_matrix.append(combined)

    return np.array(feature_matrix, dtype=np.float32)
